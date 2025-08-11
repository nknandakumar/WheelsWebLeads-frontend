import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DisbursementForm = () => {
	const navigate = useNavigate();

	// Define all 40 questions with their configurations
	const questions = [
		{
			key: "loan_id",
			label: "LOAN ID",
			type: "text",
			disabled: true,
			required: true,
		},
		{
			key: "source",
			label: "SOURCE",
			type: "dropdown",
			required: true,
			options: ["None", "Self", "Dealer", "Bank"],
		},
		{
			key: "stage",
			label: "STAGE",
			type: "dropdown",
			required: true,
			options: ["Filed", "Disbursed", "Cancellation"],
		},
		{
			key: "type",
			label: "TYPE",
			type: "dropdown",
			required: true,
			options: [
				"None",
				"Sale Purchase",
				"Refinance",
				"Int Refinance",
				"BT",
				"Topup",
				"Int Topup",
			],
		},
		{
			key: "name",
			label: "NAME",
			type: "text",
			required: true,
		},
		{
			key: "gender",
			label: "GENDER",
			type: "dropdown",
			required: true,
			options: ["None", "Male", "Female", "Other"],
		},
		{
			key: "customer_profile",
			label: "CUSTOMER PROFILE",
			type: "dropdown",
			required: true,
			options: ["None", "Self-Employed", "Salaried", "ITR", "Agriculture"],
		},
		{
			key: "pan_no",
			label: "PAN NO",
			type: "text",
			required: true,
		},
		{
			key: "mobile_no",
			label: "MOBILE NO",
			type: "text",
			required: true,
		},
		{
			key: "email_id",
			label: "EMAIL ID",
			type: "email",
			required: true,
		},
		{
			key: "dsa",
			label: "DSA",
			type: "dropdown",
			required: true,
			options: [
				"None",
				"Wheels Web",
				"Girnar Software Pvt Ltd",
				"Kuwy",
				"Tractor Junction",
				"Cars Adda",
			],
		},
		{
			key: "rc_no",
			label: "RC NO",
			type: "text",
			required: true,
		},
		{
			key: "vehicle_variant",
			label: "VEHICLE / VARIANT",
			type: "text",
			required: true,
		},
		{
			key: "mfg_year",
			label: "MFG YEAR",
			type: "dropdown",
			required: true,
			options: [
				"None",
				"2010",
				"2011",
				"2012",
				"2013",
				"2014",
				"2015",
				"2016",
				"2017",
				"2018",
				"2019",
				"2020",
				"2021",
				"2022",
				"2023",
				"2024",
				"2025",
				"2026",
				"2027",
			],
		},
		{
			key: "o_s_no",
			label: "O. S NO",
			type: "dropdown",
			required: true,
			options: ["None", "1", "2", "3", "4", "5"],
		},
		{
			key: "vehicle_owner_contact_no",
			label: "VEHICLE OWNER CONTACT NO",
			type: "text",
			required: true,
		},
		{
			key: "bank_finance",
			label: "BANK / FINANCE",
			type: "dropdown",
			required: true,
			options: [
				"None",
				"AU FINANCE",
				"AXIS BANK",
				"Ambit Finvest Private Limited",
				"Bajaj Finserv",
				"Bandhan Bank",
				"Cholamandalam Investment And Finance Company",
				"EQUITAS SMALL FINANCE BANK",
				"Fortune Finance",
				"HDB FINANCE",
				"HDFC Bank",
				"ICICI Bank",
				"IDFC First Bank (Urban & Rural)",
				"IKF Finance (White Board Cars)",
				"INDUSIND Bank",
				"Indostar Finance",
				"Kogta Financier",
				"Kotak Mahindra",
				"Mahaveer Finance",
				"Mahindra Finance",
				"Manappuram Finance Limited",
				"Muthoot Capital",
				"Muthoot Money",
				"Piramal",
				"Poonawalla Fincorp",
				"Praveen Capital",
				"Saraswat Co-operative Bank",
				"TVS Credit",
				"Tata Capital",
				"Toyota Financial",
				"Vaasthu Finance",
				"YES BANK LTD",
			],
		},
		{
			key: "bank_finance_branch",
			label: "BANK / FINANCE BRANCH",
			type: "text",
			required: true,
		},
		{
			key: "login_executive_name",
			label: "LOGIN EXECUTIVE NAME",
			type: "text",
			required: true,
		},
		{
			key: "case_dealer",
			label: "CASE DEALER",
			type: "text",
			required: true,
		},
		{
			key: "dealer_mob",
			label: "DEALER MOB",
			type: "text",
		},
		{
			key: "remarks",
			label: "REMARKS",
			type: "text",
		},
		{
			key: "total_loan_amount",
			label: "TOTAL LOAN AMOUNT",
			type: "number",
			required: true,
		},
		{
			key: "pf_charges_percent",
			label: "P.F CHARGES (%)",
			type: "number",
		},
		{
			key: "documentation_charges",
			label: "DOCUMENTATION CHARGES",
			type: "number",
		},
		{
			key: "loan_insurance_charges",
			label: "LOAN INSURANCE CHARGES",
			type: "number",
		},
		{
			key: "other_charges",
			label: "OTHER CHARGES",
			type: "number",
		},
		{
			key: "rto_charges",
			label: "RTO CHARGES",
			type: "number",
		},
		{
			key: "net_loan_amount",
			label: "NET LOAN AMOUNT",
			type: "number",
		},
		{
			key: "tenure",
			label: "TENURE",
			type: "dropdown",
			options: [
				"1",
				"2",
				"3",
				"4",
				"5",
				"6",
				"7",
				"8",
				"9",
				"10",
				"11",
				"12",
				"13",
				"14",
				"15",
				"16",
				"17",
				"18",
				"19",
				"20",
				"21",
				"22",
				"23",
				"24",
				"25",
				"26",
				"27",
				"28",
				"29",
				"30",
				"31",
				"32",
				"33",
				"34",
				"35",
				"36",
				"37",
				"38",
				"39",
				"40",
				"41",
				"42",
				"43",
				"44",
				"45",
				"46",
				"47",
				"48",
				"49",
				"50",
				"51",
				"52",
				"53",
				"54",
				"55",
				"56",
				"57",
				"58",
				"59",
				"60",
				"61",
				"62",
				"63",
				"64",
				"65",
				"66",
				"67",
				"68",
				"69",
				"70",
				"71",
				"72",
				"73",
				"74",
				"75",
				"76",
				"77",
				"78",
				"79",
				"80",
				"81",
				"82",
				"83",
				"84",
				"85",
				"86",
				"87",
				"88",
				"89",
				"90",
				"91",
				"92",
				"93",
				"94",
				"95",
				"96",
				"97",
				"98",
				"99",
				"100",
				"101",
				"102",
				"103",
				"104",
				"105",
				"106",
				"107",
				"108",
				"109",
				"110",
				"111",
				"112",
				"113",
				"114",
				"115",
				"116",
				"117",
				"118",
				"119",
				"120",
				"121",
				"122",
				"123",
				"124",
				"125",
				"126",
				"127",
				"128",
				"129",
				"130",
				"131",
				"132",
				"133",
				"134",
				"135",
				"136",
				"137",
				"138",
				"139",
				"140",
				"141",
				"142",
				"143",
				"144",
				"145",
				"146",
				"147",
				"148",
				"149",
				"150",
				"151",
				"152",
				"153",
				"154",
				"155",
				"156",
				"157",
				"158",
				"159",
				"160",
				"161",
				"162",
				"163",
				"164",
				"165",
				"166",
				"167",
				"168",
				"169",
				"170",
				"171",
				"172",
				"173",
				"174",
				"175",
				"176",
				"177",
				"178",
				"179",
				"180",
			],
		},
		{
			key: "irr",
			label: "IRR",
			type: "number",
		},
		{
			key: "emi_amount",
			label: "EMI AMOUNT",
			type: "number",
		},
		{
			key: "emi_date",
			label: "EMI DATE",
			type: "dropdown",
			options: [
				"1",
				"2",
				"3",
				"4",
				"5",
				"6",
				"7",
				"8",
				"9",
				"10",
				"11",
				"12",
				"13",
				"14",
				"15",
				"16",
				"17",
				"18",
				"19",
				"20",
				"21",
				"22",
				"23",
				"24",
				"25",
				"26",
				"27",
				"28",
				"29",
				"30",
				"31",
			],
		},
		{
			key: "transaction_1",
			label: "TRANSACTION 1",
			type: "text",
			required: true,
		},
		{
			key: "transaction_2",
			label: "TRANSACTION 2",
			type: "text",
		},
		{
			key: "remarks_for_hold",
			label: "REMARKS FOR HOLD",
			type: "text",
		},
		{
			key: "utr",
			label: "UTR",
			type: "text",
		},
		{
			key: "rc_card_status",
			label: "RC CARD STATUS",
			type: "dropdown",
			required: true,
			options: ["SELLER", "RTO", "WHEELS WEB", "CUSTOMER"],
		},
	];

	// Initialize form data with all questions
	const initialFormData = questions.reduce((acc, question) => {
		acc[question.key] = "";
		return acc;
	}, {});

	const [formData, setFormData] = useState(initialFormData);
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
			const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/disbursements`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				alert("Disbursement created successfully!");
				navigate("/disbursements");
			} else {
				const error = await response.json();
				alert(`Error: ${error.message}`);
			}
		} catch (error) {
			console.error("Error creating disbursement:", error);
			alert("Error creating disbursement. Please try again.");
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
		const newLoanId = `LOAN-${dateStr}-${randomNum}`;
		setFormData((prev) => ({ ...prev, loan_id: newLoanId }));
	};

	const renderField = (question) => {
		const { key, label, type, options, disabled, required } = question;

		if (type === "dropdown") {
			return (
				<select
					name={key}
					value={formData[key]}
					onChange={handleChange}
					disabled={disabled}
					required={required}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
				>
					<option value="">Select {label}</option>
					{options?.map((option) => (
						<option key={option} value={option}>
							{option}
						</option>
					))}
				</select>
			);
		}

		if (type === "email") {
			return (
				<input
					type="email"
					name={key}
					value={formData[key]}
					onChange={handleChange}
					disabled={disabled}
					required={required}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
				/>
			);
		}

		if (type === "number") {
			return (
				<input
					type="number"
					name={key}
					value={formData[key]}
					onChange={handleChange}
					disabled={disabled}
					required={required}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
				/>
			);
		}

		return (
			<input
				type="text"
				name={key}
				value={formData[key]}
				onChange={handleChange}
				disabled={disabled}
				required={required}
				className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
			/>
		);
	};

	// Group questions into logical sections
	const sections = [
		{
			title: "Basic Information",
			questions: questions.slice(0, 8), // loan_id to customer_profile
		},
		{
			title: "Contact & DSA Information",
			questions: questions.slice(8, 12), // pan_no to dsa
		},
		{
			title: "Vehicle Information",
			questions: questions.slice(12, 17), // rc_no to vehicle_owner_contact_no
		},
		{
			title: "Bank & Finance Details",
			questions: questions.slice(17, 20), // bank_finance to login_executive_name
		},
		{
			title: "Dealer Information",
			questions: questions.slice(20, 22), // case_dealer to dealer_mob
		},
		{
			title: "Loan Details",
			questions: questions.slice(22, 30), // remarks to net_loan_amount
		},
		{
			title: "Financial Terms",
			questions: questions.slice(30, 33), // tenure to emi_amount
		},
		{
			title: "Transaction & Status",
			questions: questions.slice(33, 40), // emi_date to rc_card_status
		},
	];

	return (
		<div className="max-w-7xl mx-auto">
			<div className="bg-white shadow rounded-lg p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold text-gray-900">
						Create New Disbursement
					</h2>
					<div className="space-x-2">
						<button
							type="button"
							onClick={generateLoanId}
							className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
						>
							Generate Loan ID
						</button>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-8">
					{sections.map((section, sectionIndex) => (
						<div key={sectionIndex} className="bg-gray-50 p-6 rounded-lg">
							<h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
								{section.title}
						</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{section.questions.map((question) => (
									<div key={question.key}>
								<label className="block text-sm font-medium text-gray-700 mb-1">
											{question.label}
											{question.required && (
												<span className="text-red-500 ml-1">*</span>
											)}
								</label>
										{renderField(question)}
							</div>
								))}
							</div>
						</div>
					))}

					{/* Submit Buttons */}
					<div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
						<button
							type="button"
							onClick={() => navigate("/disbursements")}
							className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
						>
							{isSubmitting ? "Creating..." : "Create Disbursement"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default DisbursementForm;
