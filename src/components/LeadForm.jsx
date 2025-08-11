import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LeadForm = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		// Basic Information
		loan_id: "",
		date_time: "",
		source: "",
		stage: "",
		type: "",
		name: "",
		gender: "",
		customer_profile: "",
		marital_status: "",

		// Contact Information
		pan_no: "",
		mobile_no: "",
		alt_mobile_no: "",
		email: "",

		// Family Information
		mother_name: "",
		first_name: "",
		first_mob_no: "",
		second_name: "",
		second_mob_no: "",
		nominee_name: "",
		nominee_dob: "",
		relationship: "",

		// Loan Information
		loan_amount: "",
		dsa: "",

		// Vehicle Information
		rc_no: "",
		vehicle_variant: "",
		mfg_year: "",
		os_no: "",
		kilometre_reading: "",
		vehicle_owner_contact: "",
		vehicle_location: "",

		// Address Information
		permanent_address: "",
		permanent_landmark: "",
		permanent_category: "",
		current_address: "",
		current_landmark: "",
		current_category: "",

		// Employment Information
		employment_detail: "",
		office_address: "",
		office_landmark: "",

		// Financial Information
		bank_finance: "",
		branch: "",

		// Additional Information
		login_executive_name: "",
		case_dealer: "",
		ref_name_mob: "",
		remarks: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/leads`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				alert("Lead created successfully!");
				navigate("/leads");
			} else {
				const error = await response.json();
				alert(`Error: ${error.message}`);
			}
		} catch (error) {
			console.error("Error creating lead:", error);
			alert("Error creating lead. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const generateLoanId = () => {
		const today = new Date();
		const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
		const randomNum = Math.floor(Math.random() * 1000)
			.toString()
			.padStart(3, "0");
		const newLoanId = `LD-${dateStr}-${randomNum}`;
		setFormData((prev) => ({ ...prev, loan_id: newLoanId }));
	};

	const setCurrentDateTime = () => {
		const now = new Date().toISOString().slice(0, 16);
		setFormData((prev) => ({ ...prev, date_time: now }));
	};

	return (
		<div className="max-w-6xl mx-auto">
			<div className="bg-white shadow rounded-lg p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold text-gray-900">Create New Lead</h2>
					<div className="space-x-2 gap-2 ">
						<button
							type="button"
							onClick={generateLoanId}
							className="bg-blue-500 m-2 text-white px-4 py-2 rounded hover:bg-blue-600"
						>
							Generate Loan ID
						</button>
						<button
							type="button"
							onClick={setCurrentDateTime}
							className="bg-green-500 m-2 text-white px-4 py-2 rounded hover:bg-green-600"
						>
							Set Current Time
						</button>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-8">
					{/* Basic Information */}
					<div className="bg-gray-50 p-6 rounded-lg">
						<h3 className="text-lg font-medium text-gray-900 mb-4">
							Basic Information
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Loan ID
								</label>
								<input
									type="text"
									name="loan_id"
									value={formData.loan_id}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Date & Time
								</label>
								<input
									type="datetime-local"
									name="date_time"
									value={formData.date_time}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Source
								</label>
								<select
									name="source"
									value={formData.source}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								>
									<option value="">Select Source</option>
									<option value="Self">Self</option>
									<option value="Website">Website</option>
									<option value="Referral">Referral</option>
									<option value="Advertisement">Advertisement</option>
									<option value="Other">Other</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Stage
								</label>
								<select
									name="stage"
									value={formData.stage}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								>
									<option value="">Select Stage</option>
									<option value="Lead">Lead</option>
									<option value="Qualified">Qualified</option>
									<option value="Proposal">Proposal</option>
									<option value="Negotiation">Negotiation</option>
									<option value="Closed">Closed</option>
									<option value="Lost">Lost</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Type
								</label>
								<select
									name="type"
									value={formData.type}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								>
									<option value="">Select Type</option>
									<option value="Sale Purchase">Sale Purchase</option>
									<option value="Refinance">Refinance</option>
									<option value="Top Up">Top Up</option>
									<option value="Balance Transfer">Balance Transfer</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Full Name
								</label>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Gender
								</label>
								<select
									name="gender"
									value={formData.gender}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								>
									<option value="">Select Gender</option>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
									<option value="Other">Other</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Customer Profile
								</label>
								<select
									name="customer_profile"
									value={formData.customer_profile}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								>
									<option value="">Select Profile</option>
									<option value="Salaried">Salaried</option>
									<option value="Business">Business</option>
									<option value="Professional">Professional</option>
									<option value="Self Employed">Self Employed</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Marital Status
								</label>
								<select
									name="marital_status"
									value={formData.marital_status}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									<option value="">Select Status</option>
									<option value="Single">Single</option>
									<option value="Married">Married</option>
									<option value="Divorced">Divorced</option>
									<option value="Widowed">Widowed</option>
								</select>
							</div>
						</div>
					</div>

					{/* Contact Information */}
					<div className="bg-gray-50 p-6 rounded-lg">
						<h3 className="text-lg font-medium text-gray-900 mb-4">
							Contact Information
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									PAN Number
								</label>
								<input
									type="text"
									name="pan_no"
									value={formData.pan_no}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Mobile Number
								</label>
								<input
									type="tel"
									name="mobile_no"
									value={formData.mobile_no}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Alternate Mobile
								</label>
								<input
									type="tel"
									name="alt_mobile_no"
									value={formData.alt_mobile_no}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Email
								</label>
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>
						</div>
					</div>

					{/* Family Information */}
					<div className="bg-gray-50 p-6 rounded-lg">
						<h3 className="text-lg font-medium text-gray-900 mb-4">
							Family Information
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Mother's Name
								</label>
								<input
									type="text"
									name="mother_name"
									value={formData.mother_name}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									First Reference Name
								</label>
								<input
									type="text"
									name="first_name"
									value={formData.first_name}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									First Reference Mobile
								</label>
								<input
									type="tel"
									name="first_mob_no"
									value={formData.first_mob_no}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Second Reference Name
								</label>
								<input
									type="text"
									name="second_name"
									value={formData.second_name}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Second Reference Mobile
								</label>
								<input
									type="tel"
									name="second_mob_no"
									value={formData.second_mob_no}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Nominee Name
								</label>
								<input
									type="text"
									name="nominee_name"
									value={formData.nominee_name}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Nominee Date of Birth
								</label>
								<input
									type="date"
									name="nominee_dob"
									value={formData.nominee_dob}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Relationship with Nominee
								</label>
								<input
									type="text"
									name="relationship"
									value={formData.relationship}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
						</div>
					</div>

					{/* Loan & Vehicle Information */}
					<div className="bg-gray-50 p-6 rounded-lg">
						<h3 className="text-lg font-medium text-gray-900 mb-4">
							Loan & Vehicle Information
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Loan Amount
								</label>
								<input
									type="number"
									name="loan_amount"
									value={formData.loan_amount}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									DSA
								</label>
								<input
									type="text"
									name="dsa"
									value={formData.dsa}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									RC Number
								</label>
								<input
									type="text"
									name="rc_no"
									value={formData.rc_no}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Vehicle Variant
								</label>
								<input
									type="text"
									name="vehicle_variant"
									value={formData.vehicle_variant}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Manufacturing Year
								</label>
								<input
									type="number"
									name="mfg_year"
									value={formData.mfg_year}
									onChange={handleChange}
									min="1900"
									max={new Date().getFullYear() + 1}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									OS Number
								</label>
								<input
									type="text"
									name="os_no"
									value={formData.os_no}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Kilometre Reading
								</label>
								<input
									type="text"
									name="kilometre_reading"
									value={formData.kilometre_reading}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Vehicle Owner Contact
								</label>
								<input
									type="tel"
									name="vehicle_owner_contact"
									value={formData.vehicle_owner_contact}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Vehicle Location
								</label>
								<input
									type="text"
									name="vehicle_location"
									value={formData.vehicle_location}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>
						</div>
					</div>

					{/* Address Information */}
					<div className="bg-gray-50 p-6 rounded-lg">
						<h3 className="text-lg font-medium text-gray-900 mb-4">
							Address Information
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-4">
								<h4 className="font-medium text-gray-800">Permanent Address</h4>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Address
									</label>
									<textarea
										name="permanent_address"
										value={formData.permanent_address}
										onChange={handleChange}
										rows="3"
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Landmark
									</label>
									<input
										type="text"
										name="permanent_landmark"
										value={formData.permanent_landmark}
										onChange={handleChange}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Category
									</label>
									<input
										type="text"
										name="permanent_category"
										value={formData.permanent_category}
										onChange={handleChange}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>
							</div>

							<div className="space-y-4">
								<h4 className="font-medium text-gray-800">Current Address</h4>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Address
									</label>
									<textarea
										name="current_address"
										value={formData.current_address}
										onChange={handleChange}
										rows="3"
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Landmark
									</label>
									<input
										type="text"
										name="current_landmark"
										value={formData.current_landmark}
										onChange={handleChange}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Category
									</label>
									<input
										type="text"
										name="current_category"
										value={formData.current_category}
										onChange={handleChange}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Employment & Financial Information */}
					<div className="bg-gray-50 p-6 rounded-lg">
						<h3 className="text-lg font-medium text-gray-900 mb-4">
							Employment & Financial Information
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Employment Details
								</label>
								<input
									type="text"
									name="employment_detail"
									value={formData.employment_detail}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Office Address
								</label>
								<input
									type="text"
									name="office_address"
									value={formData.office_address}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Office Landmark
								</label>
								<input
									type="text"
									name="office_landmark"
									value={formData.office_landmark}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Bank Finance
								</label>
								<input
									type="text"
									name="bank_finance"
									value={formData.bank_finance}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Branch
								</label>
								<input
									type="text"
									name="branch"
									value={formData.branch}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
						</div>
					</div>

					{/* Additional Information */}
					<div className="bg-gray-50 p-6 rounded-lg">
						<h3 className="text-lg font-medium text-gray-900 mb-4">
							Additional Information
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Login Executive Name
								</label>
								<input
									type="text"
									name="login_executive_name"
									value={formData.login_executive_name}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Case Dealer
								</label>
								<input
									type="text"
									name="case_dealer"
									value={formData.case_dealer}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Reference Name & Mobile
								</label>
								<input
									type="text"
									name="ref_name_mob"
									value={formData.ref_name_mob}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
						</div>

						<div className="mt-4">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Remarks
							</label>
							<textarea
								name="remarks"
								value={formData.remarks}
								onChange={handleChange}
								rows="3"
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Any additional notes or comments..."
							/>
						</div>
					</div>

					{/* Submit Buttons */}
					<div className="flex justify-end space-x-4">
						<button
							type="button"
							onClick={() => navigate("/leads")}
							className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
						>
							{isSubmitting ? "Creating..." : "Create Lead"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LeadForm;
