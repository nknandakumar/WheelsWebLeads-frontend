import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const LeadList = () => {
	const [leads, setLeads] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedLead, setSelectedLead] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [isExporting, setIsExporting] = useState(false);

	// Helper function to format date
	const formatDate = (date) => {
		if (!date) return "N/A";
		return new Date(date).toLocaleString("en-IN", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	// Helper function to format phone numbers
	const formatPhone = (phone) => {
		if (!phone) return "N/A";
		return phone.replace(/\D/g, "").replace(/(\d{5})(\d{5})/, "$1 $2");
	};

	useEffect(() => {
		fetchLeads();
	}, []);

	const fetchLeads = async () => {
		try {
			const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/leads`);
			if (response.ok) {
				const data = await response.json();
				setLeads(data);
			} else {
				console.error("Failed to fetch leads");
			}
		} catch (error) {
			console.error("Error fetching leads:", error);
		} finally {
			setLoading(false);
		}
	};

	const getStageColor = (stage) => {
		const colors = {
			Lead: "bg-blue-100 text-blue-800",
			Qualified: "bg-yellow-100 text-yellow-800",
			Proposal: "bg-purple-100 text-purple-800",
			Negotiation: "bg-orange-100 text-orange-800",
			Closed: "bg-green-100 text-green-800",
			Lost: "bg-red-100 text-red-800",
		};
		return colors[stage] || "bg-gray-100 text-gray-800";
	};

	const handleView = (lead) => {
		setSelectedLead(lead);
		setShowModal(true);
	};

	const closeModal = () => {
		setShowModal(false);
		setSelectedLead(null);
	};

	const exportToCSV = async () => {
		if (leads.length === 0) return;

		try {
			setIsExporting(true);

			// Small delay to ensure loading state is shown
			await new Promise(resolve => setTimeout(resolve, 500));

			// Get all unique field names from all leads
			const allFields = new Set();
			leads.forEach((lead) => {
				if (lead.data) {
					Object.keys(lead.data).forEach((key) => allFields.add(key));
				}
			});

			// Create CSV header
			const headers = [
				"ID",
				"Name",
				"Email",
				"Phone",
				"Status",
				"Source",
				"Created At",
				...Array.from(allFields),
			];

			// Create CSV rows
			const csvRows = [headers.join(",")];
			leads.forEach((lead) => {
				const row = [
					lead.id || "",
					`"${(lead.name || "").replace(/"/g, '""')}"`,
					`"${(lead.email || "").replace(/"/g, '""')}"`,
					`"${(lead.phone || "").replace(/"/g, '""')}"`,
					`"${(lead.status || "").replace(/"/g, '""')}"`,
					`"${(lead.source || "").replace(/"/g, '""')}"`,
					`"${(lead.created_at || "").replace(/"/g, '""')}"`,
					...Array.from(allFields).map((field) => {
						const value = lead.data?.[field] || "";
						return `"${value.toString().replace(/"/g, '""')}"`;
					}),
				];
				csvRows.push(row.join(","));
			});

			// Create CSV file with timestamp in the filename
			const csvContent = csvRows.join("\n");
			const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
			const link = document.createElement('a');
			if (link.download !== undefined) {
				const url = URL.createObjectURL(blob);
				link.setAttribute('href', url);
				link.setAttribute('download', `leads_${new Date().toISOString().slice(0,10)}.csv`);
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}

			// Show success message (you could add a toast notification here)
		} catch (error) {
			console.error('Error exporting to CSV:', error);
		} finally {
			setIsExporting(false);
		}
	};

	const handlePrint = (lead) => {
		const printWindow = window.open("", "_blank");
		printWindow.document.write(`
			<html>
				<head>
					<title>Lead Details - ${lead.name}</title>
					<style>
						body { font-family: Arial, sans-serif; margin: 20px; }
						.header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
						.details { margin-bottom: 20px; }
						.detail-row { display: flex; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
						.label { font-weight: bold; width: 200px; color: #333; }
						.value { flex: 1; color: #666; }
						.section-title { font-size: 18px; font-weight: bold; margin: 20px 0 10px 0; color: #333; border-left: 4px solid #3b82f6; padding-left: 10px; }
						.all-questions { margin-top: 30px; }
						.question-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; margin-top: 20px; }
						.question-item { border: 1px solid #ddd; padding: 15px; border-radius: 8px; background-color: #f9f9f9; }
						.question-label { font-weight: bold; color: #333; margin-bottom: 8px; }
						.question-value { color: #666; }
						@media print { body { margin: 10px; } }
					</style>
				</head>
				<body>
					<div class="header">
						<h1 style="color: #3b82f6; margin: 0;">Lead Management System</h1>
						<h2 style="margin: 10px 0 0 0;">Lead Details</h2>
						<h3 style="margin: 5px 0 0 0; color: #666;">${lead.name || "N/A"}</h3>
					</div>
					
					<div class="section-title">Basic Information</div>
					<div class="details">
						<div class="detail-row">
							<span class="label">Loan ID:</span>
							<span class="value">${lead.loan_id || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">Date:</span>
							<span class="value">${
								lead.date_time
									? new Date(lead.date_time).toLocaleDateString()
									: "N/A"
							}</span>
						</div>
						<div class="detail-row">
							<span class="label">Stage:</span>
							<span class="value">${lead.stage || "N/A"}</span>
						</div>
						<div class="label">Type:</span>
						<span class="value">${lead.type || "N/A"}</span>
					</div>
					<div class="detail-row">
						<span class="label">Source:</span>
						<span class="value">${lead.source || "N/A"}</span>
					</div>
				</div>

				<div class="section-title">Contact Information</div>
				<div class="details">
					<div class="detail-row">
						<span class="label">Mobile:</span>
						<span class="value">${lead.mobile_no || "N/A"}</span>
					</div>
					<div class="detail-row">
						<span class="label">Email:</span>
						<span class="value">${lead.email || "N/A"}</span>
					</div>
				</div>

				<div class="section-title">Loan Details</div>
				<div class="details">
					<div class="detail-row">
						<span class="label">Loan Amount:</span>
						<span class="value">₹${lead.loan_amount || "N/A"}</span>
					</div>
					<div class="detail-row">
						<span class="label">Vehicle Variant:</span>
						<span class="value">${lead.vehicle_variant || "N/A"}</span>
					</div>
					<div class="detail-row">
						<span class="label">RC Number:</span>
						<span class="value">${lead.rc_no || "N/A"}</span>
					</div>
				</div>

				${
					lead.data
						? `
				<div class="section-title all-questions">All Questions & Answers (${
					Object.keys(lead.data).length
				} fields)</div>
				<div class="question-grid">
					${Object.entries(lead.data)
						.map(
							([key, value]) => `
						<div class="question-item">
							<div class="question-label">${key
								.replace(/_/g, " ")
								.replace(/\b\w/g, (l) => l.toUpperCase())}:</div>
							<div class="question-value">${value || "N/A"}</div>
						</div>
					`
						)
						.join("")}
				</div>
				`
						: ""
				}

				<div style="text-align: center; margin-top: 40px; color: #666; font-size: 12px;">
					Generated on ${new Date().toLocaleString()}
				</div>
			</body>
		</html>
		`);
		printWindow.document.close();
		printWindow.print();
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header Section */}
			<div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
				<div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
					<div className="text-center md:text-left">
						<h1 className="text-2xl md:text-3xl font-bold">Lead Management</h1>
						<p className="text-blue-100 mt-1 md:mt-2">
							Manage and track your leads efficiently
						</p>
					</div>
					<div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
						<button
							onClick={exportToCSV}
							disabled={isExporting || leads.length === 0}
							className={`${isExporting || leads.length === 0 ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg transition-colors font-semibold flex items-center justify-center space-x-2 min-w-[150px]`}
						>
							{isExporting ? (
								<>
									<svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									<span>Exporting...</span>
								</>
							) : (
								<>
									<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
									<span>{leads.length === 0 ? 'No Data to Export' : 'Export All Data'}</span>
								</>
							)}
						</button>
						<Link
							to="/leads/new"
							className="bg-white text-blue-600 px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold flex items-center justify-center space-x-2"
						>
							<svg
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 6v6m0 0v6m0-6h6m-6 0H6"
								/>
							</svg>
							<span>Create New Lead</span>
						</Link>
					</div>
				</div>
			</div>

			{/* Search and Table Section */}
			<div className="bg-white shadow rounded-lg overflow-hidden">
				{/* Search Bar */}
				<div className="p-4 sm:p-6 border-b border-gray-200">
					<div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
						<div className="flex-1 max-w-md w-full">
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<svg
										className="h-5 w-5 text-gray-400"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>
								</div>
								<input
									type="text"
									className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
									placeholder="Search leads..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
							</div>
						</div>
					</div>
				</div>
				{leads.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Lead ID</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Name</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Stage</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Mobile</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">Actions</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{leads.map((lead) => (
									<tr key={lead.id} className="hover:bg-gray-50">
										<td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 sm:px-6">{lead.loan_id || 'N/A'}</td>
										<td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 sm:px-6">{lead.name || 'N/A'}</td>
										<td className="px-4 py-4 whitespace-nowrap sm:px-6">
											<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStageColor(lead.stage)}`}>
												{lead.stage || 'N/A'}
											</span>
										</td>
										<td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 sm:px-6">{lead.mobile_no || 'N/A'}</td>
										<td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium sm:px-6">
											<button
												onClick={() => handleView(lead)}
												className="text-blue-600 hover:text-blue-900 mr-4"
											>
												View
											</button>
											<button
												onClick={() => handlePrint(lead)}
												className="text-green-600 hover:text-green-900"
											>
												Print
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="text-center py-12">
						<svg
							className="mx-auto h-16 w-16 text-gray-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
						<h3 className="mt-4 text-lg font-medium text-gray-900">
							No leads found
						</h3>
						<p className="mt-2 text-sm text-gray-500">
							{searchTerm
								? "Try adjusting your search criteria."
								: "Get started by creating a new lead."}
						</p>
						{!searchTerm && (
							<div className="mt-6">
								<Link
									to="/leads/new"
									className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
								>
									<svg
										className="h-5 w-5 mr-2"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 6v6m0 0v6m0-6h6m-6 0H6"
										/>
									</svg>
									Create New Lead
								</Link>
							</div>
						)}
					</div>
				)}
			</div>

			{/* View Modal */}
			{showModal && selectedLead && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-start md:items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
					<div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-4 sm:my-8 max-h-[calc(100vh-2rem)] overflow-y-auto">
						<div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
							<div className="flex justify-between items-center">
								<div>
									<h2 className="text-3xl font-bold text-gray-900">
										Lead Details
									</h2>
									<p className="text-gray-600 mt-1">
										Complete information for {selectedLead.name || "Lead"}
									</p>
								</div>
								<div className="flex space-x-3">
									<button
										onClick={() => handlePrint(selectedLead)}
										className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 font-semibold"
									>
										<svg
											className="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
											/>
										</svg>
										<span>Print Report</span>
									</button>
									<button
										onClick={closeModal}
										className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
									>
										Close
									</button>
								</div>
							</div>
						</div>
						<div className="p-8">
							{/* Lead ID and Status Header */}
							<div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									<div className="text-center">
										<p className="text-sm font-medium text-blue-600">Lead ID</p>
										<p className="text-2xl font-bold text-blue-900">
											{selectedLead.lead_id || "N/A"}
										</p>
									</div>
									<div className="text-center">
										<p className="text-sm font-medium text-blue-600">
											Current Stage
										</p>
										<span
											className={`inline-flex px-4 py-2 text-lg font-semibold rounded-full ${getStageColor(
												selectedLead.stage
											)}`}
										>
											{selectedLead.stage || "N/A"}
										</span>
									</div>
									<div className="text-center">
										<p className="text-sm font-medium text-blue-600">
											Loan Amount
										</p>
										<p className="text-2xl font-bold text-green-600">
											₹{selectedLead.loan_amount || "N/A"}
										</p>
									</div>
								</div>
							</div>

							{/* Main Content Grid */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
								{/* Left Column */}
								<div className="space-y-8">
									{/* Basic Information */}
									<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mt-4">
										<h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-4 flex items-center">
											<svg
												className="h-5 w-5 mr-2 text-blue-600"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
											Basic Information
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<p className="text-sm font-medium text-gray-500">
													Lead ID
												</p>
												<p className="text-lg text-gray-900">
													{selectedLead.lead_id || "N/A"}
												</p>
											</div>
											<div>
												<p className="text-sm font-medium text-gray-500">
													Name
												</p>
												<p className="text-lg text-gray-900">
													{selectedLead.name || "N/A"}
												</p>
											</div>
											<div>
												<p className="text-sm font-medium text-gray-500">
													Gender
												</p>
												<p className="text-lg text-gray-900">
													{selectedLead.gender || "N/A"}
												</p>
											</div>
											<div>
												<p className="text-sm font-medium text-gray-500">
													Customer Profile
												</p>
												<p className="text-lg text-gray-900">
													{selectedLead.customer_profile || "N/A"}
												</p>
											</div>
										</div>
									</div>

									{/* Contact Information */}
									<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
										<h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-4 flex items-center">
											<svg
												className="h-5 w-5 mr-2 text-green-600"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
												/>
											</svg>
											Contact Information
										</h3>
										<div className="space-y-4">
											<div className="grid grid-cols-2 gap-4">
												<div>
													<p className="text-sm font-medium text-gray-500">
														Mobile Number
													</p>
													<p className="text-lg font-semibold text-gray-900">
														{selectedLead.mobile_no || "N/A"}
													</p>
												</div>
												<div>
													<p className="text-sm font-medium text-gray-500">
														Email Address
													</p>
													<p className="text-lg text-gray-900 break-all">
														{selectedLead.email || "N/A"}
													</p>
												</div>
											</div>
										</div>
									</div>

									{/* Family Information */}
									<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mt-4">
										<h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-4 flex items-center">
											<svg
												className="h-5 w-5 mr-2 text-purple-600"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
												/>
											</svg>
											Family Information
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<p className="text-sm font-medium text-gray-500">
													Mother's Name
												</p>
												<p className="text-lg text-gray-900">
													{selectedLead.mother_name || "N/A"}
												</p>
											</div>
											<div>
												<p className="text-sm font-medium text-gray-500">
													First Contact Name
												</p>
												<p className="text-lg text-gray-900">
													{selectedLead.first_name || "N/A"}
												</p>
											</div>
											<div>
												<p className="text-sm font-medium text-gray-500">
													First Contact Mobile
												</p>
												<p className="text-lg text-gray-900">
													{formatPhone(selectedLead.first_mob_no || "N/A")}
												</p>
											</div>
											<div>
												<p className="text-sm font-medium text-gray-500">
													Second Contact Name
												</p>
												<p className="text-lg text-gray-900">
													{selectedLead.second_name || "N/A"}
												</p>
											</div>
											<div>
												<p className="text-sm font-medium text-gray-500">
													Second Contact Mobile
												</p>
												<p className="text-lg text-gray-900">
													{formatPhone(selectedLead.second_mob_no || "N/A")}
												</p>
											</div>
											<div>
												<p className="text-sm font-medium text-gray-500">
													Nominee Name
												</p>
												<p className="text-lg text-gray-900">
													{selectedLead.nominee_name || "N/A"}
												</p>
											</div>
											<div>
												<p className="text-sm font-medium text-gray-500">
													Nominee DOB
												</p>
												<p className="text-lg text-gray-900">
													{formatDate(selectedLead.nominee_dob)}
												</p>
											</div>
											<div>
												<p className="text-sm font-medium text-gray-500">
													Relationship
												</p>
												<p className="text-lg text-gray-900">
													{selectedLead.relationship || "N/A"}
												</p>
											</div>
										</div>
									</div>

									{/* Loan Information */}
									<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mt-4">
										<h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-4 flex items-center">
											<svg
												className="h-5 w-5 mr-2 text-green-600"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
											Loan Information
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<p className="text-sm font-medium text-gray-500">
													Loan Type
												</p>
												<p className="text-lg text-gray-900">
													{selectedLead.loan_type || "N/A"}
												</p>
											</div>
											<div>
												<p className="text-sm font-medium text-gray-500">
													Loan Amount
												</p>
												<p className="text-lg text-gray-900">
													{selectedLead.loan_amount ? `₹ ${selectedLead.loan_amount.toLocaleString()}` : "N/A"}
												</p>
											</div>
											<div>
												<p className="text-sm font-medium text-gray-500">
													EMI Amount
												</p>
												<p className="text-lg text-gray-900">
													{selectedLead.emi_amount ? `₹ ${selectedLead.emi_amount.toLocaleString()}` : "N/A"}
												</p>
											</div>
											<div>
												<p className="text-sm font-medium text-gray-500">
													EMI Start Date
												</p>
												<p className="text-lg text-gray-900">
													{formatDate(selectedLead.emi_start_date)}
												</p>
											</div>
										</div>
									</div>
								</div>

								{/* Right Column */}
								<div className="space-y-8">
									{/* Vehicle Information */}
									<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mt-4">
														<h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-4 flex items-center">
															<svg
																className="h-5 w-5 mr-2 text-orange-600"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth={2}
																	d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
																/>
															</svg>
															Vehicle Information
														</h3>
														<div className="space-y-4">
															<div className="grid grid-cols-2 gap-4">
																<div>
																	<p className="text-sm font-medium text-gray-500">
																		Vehicle Variant
																	</p>
																	<p className="text-lg font-semibold text-gray-900">
																		{selectedLead.vehicle_variant || "N/A"}
																	</p>
																</div>
																<div>
																	<p className="text-sm font-medium text-gray-500">
																		RC Number
																	</p>
																	<p className="text-lg text-gray-900">
																		{selectedLead.rc_no || "N/A"}
																	</p>
																</div>
															</div>
												<h3 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-6 flex items-center">
													<svg
														className="h-6 w-6 mr-3 text-blue-600"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
														/>
													</svg>
													All Questions & Answers (
													{Object.keys(selectedLead.data).length} fields)
												</h3>
												<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
													{Object.entries(selectedLead.data).map(([key, value]) => (
														<div
															key={key}
															className="bg-gray-50 rounded-lg p-4 border border-gray-200"
														>
															<p className="text-sm font-medium text-gray-700 mb-2 capitalize">
																{key.replace(/_/g, " ")}
															</p>
															<p className="text-sm text-gray-900 break-words">
																{value || "N/A"}
															</p>
														</div>
													))}
												</div>
											</div>
										</div>
									)}

									{/* Action Buttons */}
									<div className="mt-8 pt-6 border-t border-gray-200 flex justify-center space-x-4">
										<button
											onClick={() => handlePrint(selectedLead)}
											className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center space-x-2"
										>
											<svg
												className="h-5 w-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
												/>
											</svg>
											<span>Download Report</span>
										</button>
										<button
											onClick={closeModal}
											className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
										>
											Close Details
										</button>
									</div>
								</div>
							</div>

							{/* All Questions and Answers Section */}
							{selectedLead.data && (
								<div className="mt-8">
									<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
										<h3 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-6 flex items-center">
											<svg
												className="h-6 w-6 mr-3 text-blue-600"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
											All Questions & Answers (
											{Object.keys(selectedLead.data).length} fields)
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
											{Object.entries(selectedLead.data).map(([key, value]) => (
												<div
													key={key}
													className="bg-gray-50 rounded-lg p-4 border border-gray-200"
												>
													<p className="text-sm font-medium text-gray-700 mb-2 capitalize">
														{key.replace(/_/g, " ")}
													</p>
													<p className="text-sm text-gray-900 break-words">
														{value || "N/A"}
													</p>
												</div>
											))}
										</div>
									</div>
								</div>
							)}

							{/* Action Buttons */}
							<div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
						<button
							onClick={() => handlePrint(selectedLead)}
							className="bg-blue-600 text-white px-4 py-2 sm:px-8 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2 w-full sm:w-auto"
						>
							<svg
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
								/>
							</svg>
							<span>Download Report</span>
						</button>
						<button
							onClick={closeModal}
							className="bg-gray-600 text-white px-4 py-2 sm:px-8 sm:py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold w-full sm:w-auto text-center"
						>
							Close Details
						</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default LeadList;
