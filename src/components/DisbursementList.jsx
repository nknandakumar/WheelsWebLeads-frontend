import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const DisbursementList = () => {
	const [disbursements, setDisbursements] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedDisbursement, setSelectedDisbursement] = useState(null);
	const [showModal, setShowModal] = useState(false);

	const exportToCSV = () => {
		if (disbursements.length === 0) return;

		// Get all unique field names from all disbursements
		const allFields = new Set();
		disbursements.forEach((disbursement) => {
			if (disbursement.data) {
				Object.keys(disbursement.data).forEach((key) => allFields.add(key));
			}
		});

		// Create CSV header
		const headers = [
			"ID",
			"Loan ID",
			"Name",
			"Status",
			"Source",
			"Amount",
			"Date Time",
			...Array.from(allFields),
		];

		// Create CSV rows
		const csvRows = [headers.join(",")];
		disbursements.forEach((disbursement) => {
			const row = [
				disbursement.id || "",
				disbursement.loan_id || "",
				`"${(disbursement.name || "").replace(/"/g, '""')}"`,
				disbursement.status || "",
				disbursement.source || "",
				disbursement.amount || "",
				disbursement.date_time || "",
				...Array.from(allFields).map((field) => {
					const value = disbursement.data?.[field] || "";
					return `"${value.toString().replace(/"/g, '""')}"`;
				}),
			];
			csvRows.push(row.join(","));
		});

		// Create CSV file
		const csvContent = csvRows.join("\n");
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		if (link.download !== undefined) {
			const url = URL.createObjectURL(blob);
			link.setAttribute('href', url);
			link.setAttribute('download', 'disbursements.csv');
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	};

	useEffect(() => {
		fetchDisbursements();
	}, []);

	const fetchDisbursements = async () => {
		try {
			const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/disbursements`);
			if (response.ok) {
				const data = await response.json();
				setDisbursements(data);
			} else {
				console.error("Failed to fetch disbursements");
			}
		} catch (error) {
			console.error("Error fetching disbursements:", error);
		} finally {
			setLoading(false);
		}
	};

	const getStatusColor = (status) => {
		const colors = {
			Pending: "bg-yellow-100 text-yellow-800",
			Completed: "bg-green-100 text-green-800",
			Failed: "bg-red-100 text-red-800",
			Processing: "bg-blue-100 text-blue-800",
		};
		return colors[status] || "bg-gray-100 text-gray-800";
	};

	const handleView = (disbursement) => {
		setSelectedDisbursement(disbursement);
		setShowModal(true);
	};

	const closeModal = () => {
		setShowModal(false);
		setSelectedDisbursement(null);
	};

	const handlePrint = (disbursement) => {
		const printWindow = window.open("", "_blank");
		printWindow.document.write(`
			<html>
				<head>
					<title>Disbursement Details - ${disbursement.name || "N/A"}</title>
					<style>
						body { font-family: Arial, sans-serif; margin: 20px; }
						.header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
						.details { margin-bottom: 20px; }
						.detail-row { display: flex; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
						.label { font-weight: bold; width: 200px; color: #333; }
						.value { flex: 1; color: #666; }
						.section-title { font-size: 18px; font-weight: bold; margin: 20px 0 10px 0; color: #333; border-left: 4px solid #059669; padding-left: 10px; }
						@media print { body { margin: 10px; } }
					</style>
				</head>
				<body>
					<div class="header">
						<h1 style="color: #059669; margin: 0;">Disbursement Management System</h1>
						<h2 style="margin: 10px 0 0 0;">Disbursement Details</h2>
						<h3 style="margin: 5px 0 0 0; color: #666;">${disbursement.name || "N/A"}</h3>
					</div>
					
					<div class="section-title">Basic Information</div>
					<div class="details">
						<div class="detail-row">
							<span class="label">Loan ID:</span>
							<span class="value">${disbursement.loan_id || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">Name:</span>
							<span class="value">${disbursement.name || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">Source:</span>
							<span class="value">${disbursement.source || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">Stage:</span>
							<span class="value">${disbursement.stage || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">Type:</span>
							<span class="value">${disbursement.type || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">Gender:</span>
							<span class="value">${disbursement.gender || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">Customer Profile:</span>
							<span class="value">${disbursement.customer_profile || "N/A"}</span>
						</div>
					</div>

					<div class="section-title">Contact Information</div>
					<div class="details">
						<div class="detail-row">
							<span class="label">PAN Number:</span>
							<span class="value">${disbursement.pan_no || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">Mobile Number:</span>
							<span class="value">${disbursement.mobile_no || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">Email ID:</span>
							<span class="value">${disbursement.email_id || "N/A"}</span>
						</div>
					</div>

					<div class="section-title">Vehicle Information</div>
					<div class="details">
						<div class="detail-row">
							<span class="label">RC Number:</span>
							<span class="value">${disbursement.rc_no || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">Vehicle Variant:</span>
							<span class="value">${disbursement.vehicle_variant || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">Manufacturing Year:</span>
							<span class="value">${disbursement.mfg_year || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">O.S Number:</span>
							<span class="value">${disbursement.o_s_no || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">Vehicle Owner Contact:</span>
							<span class="value">${disbursement.vehicle_owner_contact_no || "N/A"}</span>
						</div>
					</div>

					<div class="section-title">Bank & Finance Details</div>
					<div class="details">
						<div class="detail-row">
							<span class="label">Bank/Finance:</span>
							<span class="value">${disbursement.bank_finance || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">Branch:</span>
							<span class="value">${disbursement.bank_finance_branch || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">Login Executive:</span>
							<span class="value">${disbursement.login_executive_name || "N/A"}</span>
						</div>
					</div>

					<div class="section-title">DSA & Dealer Information</div>
					<div class="details">
						<div class="detail-row">
							<span class="label">DSA:</span>
							<span class="value">${disbursement.dsa || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">Case Dealer:</span>
							<span class="value">${disbursement.case_dealer || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">Dealer Mobile:</span>
							<span class="value">${disbursement.dealer_mob || "N/A"}</span>
						</div>
					</div>

					<div class="section-title">Financial Details</div>
					<div class="details">
						<div class="detail-row">
							<span class="label">Total Loan Amount:</span>
							<span class="value">₹${disbursement.total_loan_amount || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">P.F Charges (%):</span>
							<span class="value">${disbursement.pf_charges_percent || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">Documentation Charges:</span>
							<span class="value">₹${disbursement.documentation_charges || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">Loan Insurance Charges:</span>
							<span class="value">₹${disbursement.loan_insurance_charges || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">Other Charges:</span>
							<span class="value">₹${disbursement.other_charges || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">RTO Charges:</span>
							<span class="value">₹${disbursement.rto_charges || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">Net Loan Amount:</span>
							<span class="value">₹${disbursement.net_loan_amount || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">Tenure (Months):</span>
							<span class="value">${disbursement.tenure || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">IRR (%):</span>
							<span class="value">${disbursement.irr || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">EMI Amount:</span>
							<span class="value">₹${disbursement.emi_amount || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">EMI Date:</span>
							<span class="value">${disbursement.emi_date || "N/A"}</span>
						</div>
					</div>

					<div class="section-title">Transaction Information</div>
					<div class="details">
						<div class="detail-row">
							<span class="label">Transaction 1:</span>
							<span class="value">${disbursement.transaction_1 || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">Transaction 2:</span>
							<span class="value">${disbursement.transaction_2 || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">UTR:</span>
							<span class="value">${disbursement.utr || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">RC Card Status:</span>
							<span class="value">${disbursement.rc_card_status || "N/A"}</span>
						</div>
					</div>

					<div class="section-title">Additional Information</div>
					<div class="details">
						<div class="detail-row">
							<span class="label">Remarks:</span>
							<span class="value">${disbursement.remarks || "N/A"}</span>
						</div>
						<div class="detail-row">
							<span class="label">Remarks for Hold:</span>
							<span class="value">${disbursement.remarks_for_hold || "N/A"}</span>
						</div>
					</div>

					${
						disbursement.data
							? `
					<div class="section-title">All Questions & Answers (${
						Object.keys(disbursement.data).length
					} fields)</div>
					<div class="details">
						${Object.entries(disbursement.data)
							.map(
								([key, value]) => `
							<div class="detail-row">
								<span class="label">${key
									.replace(/_/g, " ")
									.replace(/\b\w/g, (l) => l.toUpperCase())}:</span>
								<span class="value">${value || "N/A"}</span>
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
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header Section */}
			<div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-4 sm:p-6 text-white">
				<div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
					<div className="text-center md:text-left">
						<h1 className="text-2xl md:text-3xl font-bold">
							Disbursement Management System
						</h1>
						<p className="text-green-100 mt-1 md:mt-2">
							Complete disbursement tracking with all 40 questions - Manage
							loans, vehicles, and financial details efficiently
						</p>
					</div>
					<div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
						<button
							onClick={exportToCSV}
							className="bg-white text-green-600 px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-green-50 transition-colors font-semibold flex items-center justify-center space-x-2"
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
									d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
							<span>Export All Data</span>
						</button>
						<Link
							to="/disbursements/new"
							className="bg-white text-green-600 px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-green-50 transition-colors font-semibold flex items-center justify-center space-x-2"
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
						<span>Create New Disbursement</span>
					</Link>
				</div>
			</div>
		</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
				<div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
					<div className="flex items-center">
						<div className="p-2 bg-green-100 rounded-lg">
							<svg
								className="h-6 w-6 text-green-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
						</div>
						<div className="ml-4">
							<p className="text-sm font-medium text-gray-600">
								Total Disbursements
							</p>
							<p className="text-2xl font-semibold text-gray-900">
								{disbursements.length}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Search and Table Section */}
			<div className="bg-white shadow rounded-lg">
				{/* Search Bar */}
				<div className="p-6 border-b border-gray-200">
					<div className="flex items-center space-x-4">
						<div className="flex-1 max-w-md">
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
									placeholder="Search by name, loan ID, mobile no, or PAN no..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
								/>
							</div>
						</div>
						<button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
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
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
							<span>Search</span>
						</button>
					</div>
				</div>

					{/* Debug information - Only log in development */}


				

				{disbursements.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
										LOAN ID
									</th>
									<th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
										NAME
									</th>
									<th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
										SOURCE
									</th>
									<th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
										STAGE
									</th>
									<th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
										TYPE
									</th>
									<th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
										MOBILE NO
									</th>
									<th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
										BANK/FINANCE
									</th>
									<th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
										LOAN AMOUNT
									</th>
									<th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
										ACTIONS
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{disbursements
									.filter(disbursement => {
										// If search term is empty, show all disbursements
										if (!searchTerm.trim()) return true;
										
										// Convert all values to strings and handle null/undefined cases
										const name = String(disbursement.name || '').toLowerCase();
										const loanId = String(disbursement.loan_id || '').toLowerCase();
										const mobileNo = String(disbursement.mobile_no || '');
										const panNo = String(disbursement.pan_no || '').toLowerCase();
										const search = searchTerm.trim().toLowerCase();
										
										// Check if any field contains the search term
										return name.includes(search) || 
											   loanId.includes(search) || 
											   mobileNo.includes(searchTerm) || 
											   panNo.includes(search);
									})
									.map((disbursement) => (
										<tr
											key={disbursement.id}
											className="hover:bg-gray-50 transition-colors"
										>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
												{disbursement.loan_id || "N/A"}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
												{disbursement.name || "N/A"}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
												{disbursement.source || "N/A"}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
												{disbursement.stage || "N/A"}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
												{disbursement.type || "N/A"}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
												{disbursement.mobile_no || "N/A"}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
												{disbursement.bank_finance || "N/A"}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
												₹{disbursement.total_loan_amount || "N/A"}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
												<div className="flex space-x-2">
													<button
														onClick={() => handleView(disbursement)}
														className="text-blue-600 hover:text-blue-800 transition-colors flex items-center px-3 py-1 rounded-md hover:bg-blue-50"
													>
														<svg
															className="h-4 w-4 mr-1"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
															/>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
															/>
														</svg>
														View
													</button>
													<button
														onClick={() => handlePrint(disbursement)}
														className="text-green-600 hover:text-green-800 transition-colors flex items-center px-3 py-1 rounded-md hover:bg-green-50"
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
														Print
													</button>
												</div>
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
							No disbursements found
						</h3>
						<p className="mt-2 text-sm text-gray-500">
							{searchTerm
								? "Try adjusting your search criteria. You can search by name, loan ID, mobile number, or PAN number."
								: "Get started by creating a new disbursement with all 40 required questions."}
						</p>
						{!searchTerm && (
							<div className="mt-6">
								<Link
									to="/disbursements/new"
									className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
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
									Create New Disbursement
								</Link>
							</div>
						)}
					</div>
				)}
			</div>

			{/* View Modal */}
			{showModal && selectedDisbursement && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg max-w-7xl w-full max-h-[95vh] overflow-y-auto">
						<div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
							<div className="flex justify-between items-center">
								<div>
									<h2 className="text-3xl font-bold text-gray-900">
										Disbursement Details
									</h2>
									<p className="text-gray-600 mt-1">
										Complete information for{" "}
										{selectedDisbursement.name || "Disbursement"}
									</p>
								</div>
								<div className="flex space-x-3">
									<button
										onClick={() => handlePrint(selectedDisbursement)}
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
							{/* Disbursement ID and Status Header */}
							<div className="mb-8 p-6 bg-green-50 rounded-lg border border-green-200">
								<div className="grid grid-cols-1 md:grid-cols-5 gap-6">
									<div className="text-center">
										<p className="text-sm font-medium text-green-600">
											Loan ID
										</p>
										<p className="text-2xl font-bold text-green-900">
											{selectedDisbursement.loan_id || "N/A"}
										</p>
									</div>
									<div className="text-center">
										<p className="text-sm font-medium text-green-600">Stage</p>
										<p className="text-xl font-semibold text-green-900">
											{selectedDisbursement.stage || "N/A"}
										</p>
									</div>
									<div className="text-center">
										<p className="text-sm font-medium text-green-600">Type</p>
										<span
											className={`inline-flex px-4 py-2 text-lg font-semibold rounded-full ${getStatusColor(
												selectedDisbursement.type
											)}`}
										>
											{selectedDisbursement.type || "N/A"}
										</span>
									</div>
									<div className="text-center">
										<p className="text-sm font-medium text-green-600">
											Loan Amount
										</p>
										<p className="text-2xl font-bold text-green-600">
											₹{selectedDisbursement.total_loan_amount || "N/A"}
										</p>
									</div>
									<div className="text-center">
										<p className="text-sm font-medium text-green-600">Source</p>
										<p className="text-lg font-semibold text-green-900">
											{selectedDisbursement.source || "N/A"}
										</p>
									</div>
								</div>
							</div>

							{/* Main Content Grid */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
								{/* Left Column */}
								<div className="space-y-8">
									{/* Basic Information */}
									<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
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
													d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
												/>
											</svg>
											Basic Information
										</h3>
										<div className="space-y-4">
											<div className="grid grid-cols-2 gap-4">
												<div>
													<p className="text-sm font-medium text-gray-500">
														Customer Name
													</p>
													<p className="text-lg font-semibold text-gray-900">
														{selectedDisbursement.name || "N/A"}
													</p>
												</div>
												<div>
													<p className="text-sm font-medium text-gray-500">
														Gender
													</p>
													<p className="text-lg text-gray-900">
														{selectedDisbursement.gender || "N/A"}
													</p>
												</div>
											</div>
											<div className="grid grid-cols-2 gap-4">
												<div>
													<p className="text-sm font-medium text-gray-500">
														Customer Profile
													</p>
													<p className="text-lg text-gray-900">
														{selectedDisbursement.customer_profile || "N/A"}
													</p>
												</div>
												<div>
													<p className="text-sm font-medium text-gray-500">
														PAN Number
													</p>
													<p className="text-lg text-gray-900">
														{selectedDisbursement.pan_no || "N/A"}
													</p>
												</div>
											</div>
											<div className="grid grid-cols-2 gap-4">
												<div>
													<p className="text-sm font-medium text-gray-500">
														Mobile Number
													</p>
													<p className="text-lg text-gray-900">
														{selectedDisbursement.mobile_no || "N/A"}
													</p>
												</div>
												<div>
													<p className="text-sm font-medium text-gray-500">
														Email ID
													</p>
													<p className="text-lg text-gray-900">
														{selectedDisbursement.email_id || "N/A"}
													</p>
												</div>
											</div>
										</div>
									</div>

									{/* Vehicle Information */}
									<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
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
														RC Number
													</p>
													<p className="text-lg font-semibold text-gray-900">
														{selectedDisbursement.rc_no || "N/A"}
													</p>
												</div>
												<div>
													<p className="text-sm font-medium text-gray-500">
														Vehicle Variant
													</p>
													<p className="text-lg text-gray-900">
														{selectedDisbursement.vehicle_variant || "N/A"}
													</p>
												</div>
											</div>
											<div className="grid grid-cols-2 gap-4">
												<div>
													<p className="text-sm font-medium text-gray-500">
														Manufacturing Year
													</p>
													<p className="text-lg text-gray-900">
														{selectedDisbursement.mfg_year || "N/A"}
													</p>
												</div>
												<div>
													<p className="text-sm font-medium text-gray-500">
														O.S Number
													</p>
													<p className="text-lg text-gray-900">
														{selectedDisbursement.o_s_no || "N/A"}
													</p>
												</div>
											</div>
											<div>
												<p className="text-sm font-medium text-gray-500">
													Vehicle Owner Contact
												</p>
												<p className="text-lg text-gray-900">
													{selectedDisbursement.vehicle_owner_contact_no ||
														"N/A"}
												</p>
											</div>
										</div>
									</div>

									{/* Banking Information */}
									<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
										<h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-4 flex items-center">
											<svg
												className="h-5 w-5 mr-2 text-indigo-600"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
												/>
											</svg>
											Banking Information
										</h3>
										<div className="space-y-4">
											<div className="grid grid-cols-2 gap-4">
												<div>
													<p className="text-sm font-medium text-gray-500">
														Bank/Finance
													</p>
													<p className="text-lg font-semibold text-gray-900">
														{selectedDisbursement.bank_finance || "N/A"}
													</p>
												</div>
												<div>
													<p className="text-sm font-medium text-gray-500">
														Branch
													</p>
													<p className="text-lg text-gray-900">
														{selectedDisbursement.bank_finance_branch || "N/A"}
													</p>
												</div>
											</div>
											<div>
												<p className="text-sm font-medium text-gray-500">
													Login Executive
												</p>
												<p className="text-lg text-gray-900">
													{selectedDisbursement.login_executive_name || "N/A"}
												</p>
											</div>
										</div>
									</div>
								</div>

								{/* Right Column */}
								<div className="space-y-8">
									{/* DSA & Dealer Information */}
									<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
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
											DSA & Dealer Information
										</h3>
										<div className="space-y-4">
											<div className="grid grid-cols-2 gap-4">
												<div>
													<p className="text-sm font-medium text-gray-500">
														DSA
													</p>
													<p className="text-lg font-semibold text-gray-900">
														{selectedDisbursement.dsa || "N/A"}
													</p>
												</div>
												<div>
													<p className="text-sm font-medium text-gray-500">
														Case Dealer
													</p>
													<p className="text-lg text-gray-900">
														{selectedDisbursement.case_dealer || "N/A"}
													</p>
												</div>
											</div>
											<div>
												<p className="text-sm font-medium text-gray-500">
													Dealer Mobile
												</p>
												<p className="text-lg text-gray-900">
													{selectedDisbursement.dealer_mob || "N/A"}
												</p>
											</div>
										</div>
									</div>

									{/* Financial Details */}
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
													d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
												/>
											</svg>
											Financial Details
										</h3>
										<div className="space-y-4">
											<div className="grid grid-cols-2 gap-4">
												<div>
													<p className="text-sm font-medium text-gray-500">
														Total Loan Amount
													</p>
													<p className="text-2xl font-bold text-green-600">
														₹{selectedDisbursement.total_loan_amount || "N/A"}
													</p>
												</div>
												<div>
													<p className="text-sm font-medium text-gray-500">
														Net Loan Amount
													</p>
													<p className="text-lg font-semibold text-gray-900">
														₹{selectedDisbursement.net_loan_amount || "N/A"}
													</p>
												</div>
											</div>
											<div className="grid grid-cols-2 gap-4">
												<div>
													<p className="text-sm font-medium text-gray-500">
														Tenure (Months)
													</p>
													<p className="text-lg text-gray-900">
														{selectedDisbursement.tenure || "N/A"}
													</p>
												</div>
												<div>
													<p className="text-sm font-medium text-gray-500">
														EMI Amount
													</p>
													<p className="text-lg text-gray-900">
														₹{selectedDisbursement.emi_amount || "N/A"}
													</p>
												</div>
											</div>
											<div className="grid grid-cols-2 gap-4">
												<div>
													<p className="text-sm font-medium text-gray-500">
														IRR (%)
													</p>
													<p className="text-lg text-gray-900">
														{selectedDisbursement.irr || "N/A"}
													</p>
												</div>
												<div>
													<p className="text-sm font-medium text-gray-500">
														EMI Date
													</p>
													<p className="text-lg text-gray-900">
														{selectedDisbursement.emi_date || "N/A"}
													</p>
												</div>
											</div>
										</div>
									</div>

									{/* Transaction Information */}
									<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
										<h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-4 flex items-center">
											<svg
												className="h-5 w-5 mr-2 text-yellow-600"
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
											Transaction Information
										</h3>
										<div className="space-y-4">
											<div className="grid grid-cols-2 gap-4">
												<div>
													<p className="text-sm font-medium text-gray-500">
														Transaction 1
													</p>
													<p className="text-lg font-semibold text-gray-900">
														{selectedDisbursement.transaction_1 || "N/A"}
													</p>
												</div>
												<div>
													<p className="text-sm font-medium text-gray-500">
														Transaction 2
													</p>
													<p className="text-lg text-gray-900">
														{selectedDisbursement.transaction_2 || "N/A"}
													</p>
												</div>
											</div>
											<div className="grid grid-cols-2 gap-4">
												<div>
													<p className="text-sm font-medium text-gray-500">
														UTR
													</p>
													<p className="text-lg text-gray-900">
														{selectedDisbursement.utr || "N/A"}
													</p>
												</div>
												<div>
													<p className="text-sm font-medium text-gray-500">
														RC Card Status
													</p>
													<p className="text-lg text-gray-900">
														{selectedDisbursement.rc_card_status || "N/A"}
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* All Questions and Answers Section */}
							{selectedDisbursement.data && (
								<div className="mt-8">
									<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
										<h3 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-6 flex items-center">
											<svg
												className="h-6 w-6 mr-3 text-green-600"
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
											{Object.keys(selectedDisbursement.data).length} fields)
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
											{Object.entries(selectedDisbursement.data).map(
												([key, value]) => (
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
												)
											)}
										</div>
									</div>
								</div>
							)}

							{/* Additional Information */}
							<div className="mt-8 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
								<h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-4 flex items-center">
									<svg
										className="h-5 w-5 mr-2 text-red-600"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
										/>
									</svg>
									Additional Information
								</h3>
								<div className="space-y-4">
									<div className="grid grid-cols-2 gap-4">
										<div>
											<p className="text-sm font-medium text-gray-500">
												Remarks
											</p>
											<p className="text-lg text-gray-900">
												{selectedDisbursement.remarks || "N/A"}
											</p>
										</div>
										<div>
											<p className="text-sm font-medium text-gray-500">
												Remarks for Hold
											</p>
											<p className="text-lg text-gray-900">
												{selectedDisbursement.remarks_for_hold || "N/A"}
											</p>
										</div>
									</div>
									<div className="grid grid-cols-2 gap-4">
										
										<div>
											<p className="text-sm font-medium text-gray-500">
												Created Date & Time
											</p>
											<p className="text-lg text-gray-900">
												{selectedDisbursement.date_time
													? new Date(
															selectedDisbursement.date_time
													  ).toLocaleString("en-IN", {
															year: "numeric",
															month: "long",
															day: "numeric",
															hour: "2-digit",
															minute: "2-digit",
													  })
													: "N/A"}
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="mt-8 pt-6 border-t border-gray-200 flex justify-center space-x-4">
								<button
									onClick={() => handlePrint(selectedDisbursement)}
									className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center space-x-2"
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
				</div>
			)}
		</div>
	);
};

export default DisbursementList;
