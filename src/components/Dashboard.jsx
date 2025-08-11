import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
	const [stats, setStats] = useState({
		totalLeads: 0,
		totalDisbursements: 0,
		recentLeads: [],
	});

	useEffect(() => {
		// Fetch dashboard data
		const fetchDashboardData = async () => {
			try {
				const [leadsRes, disbursementsRes] = await Promise.all([
					fetch(`${import.meta.env.VITE_BASE_URL}/api/leads`),
					fetch(`${import.meta.env.VITE_BASE_URL}/api/disbursements`),
				]);

				const leads = await leadsRes.json();
				const disbursements = await disbursementsRes.json();

				setStats({
					totalLeads: leads.length,
					totalDisbursements: disbursements.length,
					recentLeads: leads.slice(0, 5),
				});
			} catch (error) {
				console.error("Error fetching dashboard data:", error);
			}
		};

		fetchDashboardData();
	}, []);

	return (
		<div className="space-y-6">
			<div className="bg-white shadow rounded-lg p-6">
				<h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
					<div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
						<div className="flex items-center">
							<div className="p-3 bg-blue-500 rounded-full">
								<svg
									className="w-6 h-6 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								</svg>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-blue-600">Total Leads</p>
								<p className="text-2xl font-semibold text-blue-900">
									{stats.totalLeads}
								</p>
							</div>
						</div>
					</div>

					<div className="bg-green-50 p-6 rounded-lg border border-green-200">
						<div className="flex items-center">
							<div className="p-3 bg-green-500 rounded-full">
								<svg
									className="w-6 h-6 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
									/>
								</svg>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-green-600">
									Total Disbursements
								</p>
								<p className="text-2xl font-semibold text-green-900">
									{stats.totalDisbursements}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Mobile Navigation Links */}
				<div className="md:hidden grid grid-cols-1 gap-4 mb-6">
					<Link
						to="/leads"
						className="bg-blue-100 text-blue-700 px-6 py-3 rounded-lg hover:bg-blue-200 transition-colors text-center font-medium flex items-center justify-center space-x-2"
					>
						<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
						</svg>
						<span>View All Leads</span>
					</Link>
					<Link
						to="/disbursements"
						className="bg-green-100 text-green-700 px-6 py-3 rounded-lg hover:bg-green-200 transition-colors text-center font-medium flex items-center justify-center space-x-2"
					>
						<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
						</svg>
						<span>View All Disbursements</span>
					</Link>
				</div>

				{/* Quick Actions */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Link
						to="/leads/new"
						className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
					>
						Create New Lead
					</Link>
					<Link
						to="/disbursements/new"
						className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-center font-medium"
					>
						Create New Disbursement
					</Link>
				</div>
			</div>

			{/* Recent Leads */}
			<div className="bg-white shadow rounded-lg p-6">
				<h3 className="text-lg font-medium text-gray-900 mb-4">Recent Leads</h3>
				{stats.recentLeads.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Name
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Loan ID
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Stage
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{stats.recentLeads.map((lead) => (
									<tr key={lead.id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											{lead.name}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{lead.loan_id}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{lead.stage}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<p className="text-gray-500 text-center py-4">No leads found</p>
				)}
			</div>
		</div>
	);
};

export default Dashboard;
