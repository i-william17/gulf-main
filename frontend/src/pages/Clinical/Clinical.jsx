import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import ReportSection from "../Admin/ReportSection";
import "react-toastify/dist/ReactToastify.css";
import { TESTS_BY_UNIT } from '../Lab/LabFunctions';
import TopBar from "../../components/TopBar";


const Clinical = () => {
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [testTypeFilter, setTestTypeFilter] = useState("All");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [clinicalNotes, setClinicalNotes] = useState("");
    const [clinicalOfficerName, setClinicalOfficerName] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [historyOfPastIllness, setHistoryOfPastIllness] = useState("");
    const [allergy, setAllergy] = useState("");
    const [selectedUnits, setSelectedUnits] = useState({});
    const [selectedTests, setSelectedTests] = useState({});
    const [selectAll, setSelectAll] = useState({});

    const [formData, setFormData] = useState({
        generalExamination: {},
        systemicExamination: {},
        otherTests: {},
        clinicalNotes: "",
        clinicalOfficerName: "",
        height: "",
        weight: "",
        historyOfPastIllness: "",
        allergy: ""
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/radiology");
                const test = response.data.map(report => ({
                    ...report,
                    radiologyData: {
                        heafMantouxTest: report.heafMantouxTest,
                        chestXRayTest: report.chestXRayTest
                    }
                }));
                setReports(test);
                setFilteredReports(test);
                toast.success('Reports Successfully Fetched.')
                setIsLoading(false);
            } catch (error) {
                toast.error("Error Fetching Clinical Reports");
                setIsLoading(false);
            }
        };

        fetchReports();
    }, []);

    useEffect(() => {
        let filtered = reports;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter((report) =>
                (report.patientName &&
                    report.patientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (report.labNumber &&
                    report.labNumber.toString().includes(searchTerm.toLowerCase()))
            );
        }

        // Filter by test type
        if (testTypeFilter !== "All") {
            filtered = filtered.filter((report) => report.testType === testTypeFilter);
        }

        // Filter by date range
        if (dateRange.start && dateRange.end) {
            filtered = filtered.filter(
                (report) =>
                    new Date(report.timestamp) >= new Date(dateRange.start) &&
                    new Date(report.timestamp) <= new Date(dateRange.end)
            );
        }

        setFilteredReports(filtered);
    }, [reports, searchTerm, testTypeFilter, dateRange]);

    const handleUnitSelect = (unit) => {
        setSelectedUnits((prev) => ({
            ...prev,
            [unit]: !prev[unit],
        }));
        if (selectedUnits[unit]) {
            setSelectAll((prev) => ({ ...prev, [unit]: false }));
            setSelectedTests((prev) => ({ ...prev, [unit]: {} }));
        }
    };

    const handleTestSelect = (category, test) => {
        setSelectedTests(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [test]: !prev[category]?.[test]
            }
        }));

        // Reset the value if unselecting
        if (selectedTests[category]?.[test]) {
            setFormData(prev => ({
                ...prev,
                [category]: {
                    ...prev[category],
                    [test]: ""
                }
            }));
        }
    };

    // Modified handleTestValue to update test values
    const handleTestValue = (category, test, value) => {
        setFormData(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [test]: value
            }
        }));
    };

    // Modified handleSelectAll
    const handleSelectAllTests = (category) => {
        const allTestsSelected = !selectAll[category];
        setSelectAll(prev => ({ ...prev, [category]: allTestsSelected }));

        const updatedTests = {};
        const updatedValues = {};

        TESTS_BY_UNIT[category].forEach(test => {
            updatedTests[test] = allTestsSelected;
            if (!allTestsSelected) {
                updatedValues[test] = "";
            }
        });

        setSelectedTests(prev => ({
            ...prev,
            [category]: updatedTests
        }));

        if (!allTestsSelected) {
            setFormData(prev => ({
                ...prev,
                [category]: updatedValues
            }));
        }
    };

    // Modified handleSubmit
    const handleSubmit = async () => {
        try {
            // Validate required fields
            if (!formData.clinicalOfficerName) {
                toast.error("Clinical Officer Name is required");
                return;
            }

            // Filter out unselected tests
            const filteredData = {
                generalExamination: {},
                systemicExamination: {},
                otherTests: {}
            };

            ['generalExamination', 'systemicExamination', 'otherTests'].forEach(category => {
                Object.keys(selectedTests[category] || {}).forEach(test => {
                    if (selectedTests[category][test]) {
                        filteredData[category][test] = formData[category][test] || '';
                    }
                });
            });

            const clinicalReport = {
                selectedReport,
                ...filteredData,
                clinicalNotes: formData.clinicalNotes,
                clinicalOfficerName: formData.clinicalOfficerName,
                height: formData.height,
                weight: formData.weight,
                historyOfPastIllness: formData.historyOfPastIllness,
                allergy: formData.allergy,
                radiologyData: selectedReport?.radiologyData
            };
            console.log(clinicalReport);

            await axios.post("http://localhost:5000/api/clinical", clinicalReport);
            toast.success("Report successfully created");

            // Reset form
            setFormData({
                generalExamination: {},
                systemicExamination: {},
                otherTests: {},
                clinicalNotes: "",
                clinicalOfficerName: "",
                height: "",
                weight: "",
                historyOfPastIllness: "",
                allergy: ""
            });
            setSelectedTests({});
            setSelectAll({});
            setSelectedUnits({});
            window.location.reload();
        } catch (error) {
            toast.error("Error creating report");
            console.error(error);
        }
    };

    // Render examination section
    const renderExaminationSection = (category, title) => (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h3 className='flex items-center gap-4 text-xl font-semibold mb-4 text-black'>
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300"
                        checked={selectedUnits[category] || false}
                        onChange={() => handleUnitSelect(category)}
                    />
                    <b>{title}</b>
                </label>
                {selectedUnits[category] && (
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300"
                            checked={selectAll[category] || false}
                            onChange={() => handleSelectAllTests(category)}
                        />
                        Select All
                    </label>
                )}
            </h3>
            {selectedUnits[category] && (
                <div className="grid grid-cols-1 gap-4">
                    {TESTS_BY_UNIT[category].map(test => (
                        <div key={test} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                            <label className="flex items-center gap-2 text-black">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300"
                                    checked={selectedTests[category]?.[test] || false}
                                    onChange={() => handleTestSelect(category, test)}
                                />
                                {test.charAt(0).toUpperCase() + test.slice(1)}:
                            </label>
                            {selectedTests[category]?.[test] && (
                                <input
                                    type="text"
                                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    value={formData[category][test] || ""}
                                    onChange={(e) => handleTestValue(category, test, e.target.value)}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );


    const paginatedReports = filteredReports.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <>
            <TopBar />
            <div className="bg-gray-50 text-black min-h-screen transition-all duration-300">
                <div className="flex justify-between items-center p-4 bg-gray-800 text-white shadow-md">
                    <h1 className="text-2xl font-bold">Clinical Reports</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-1 px-2 py-1">

                    {/* Sidebar */}
                    <div className="bg-white dark:bg-gray-200 rounded-lg shadow-lg p-4 overflow-y-auto">
                        <input
                            type="text"
                            placeholder="Search by lab number"
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        {isLoading ? (
                            <p className="text-center">Loading Reports, Please Wait...</p>
                        ) : paginatedReports.length > 0 ? (
                            paginatedReports.map((report) => (
                                <div
                                    key={report._id}
                                    onClick={() => setSelectedReport(report)}
                                    className={`relative p-4 rounded-lg mb-4 transition-all duration-300 ease-in-out hover:scale-105 border shadow-md hover:shadow-lg
          ${selectedReport?._id === report._id
                                            ? "bg-gradient-to-br from-teal-600 to-teal-700 text-white border-teal-400"
                                            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-teal-50 dark:hover:bg-teal-900"
                                        }`}
                                >
                                    <div className="flex flex-col items-center space-y-3">
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-teal-400 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                                            <div className="w-24 h-24 border-2 border-gray-200 dark:border-gray-600 rounded-full overflow-hidden bg-gray-50 dark:bg-gray-700 shadow-inner">
                                                {report.patientImage ? (
                                                    <img
                                                        src={`data:image/jpeg;base64,${report.patientImage}`}
                                                        alt="Patient"
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span className="text-gray-400 dark:text-gray-500 text-2xl font-light">-</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="w-full space-y-1 text-center">
                                            <h3 className={`text-base font-semibold ${selectedReport?._id === report._id ? "text-white" : "text-gray-800 dark:text-gray-200"}`}>
                                                Name: {report.patientName}
                                            </h3>
                                            <div className={`text-xs ${selectedReport?._id === report._id ? "text-teal-100" : "text-gray-600 dark:text-gray-400"}`}>
                                                <p>Lab Number: {report.labNumber}</p>
                                                <p>Date: {new Date(report.timeStamp).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No reports found.</p>
                        )}

                        {/* Pagination */}
                        <div className="flex justify-between items-center mt-4">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => prev - 1)}
                                className={`px-3 py-1.5 bg-blue-500 text-white rounded-lg transition-opacity ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
                            >
                                <FaChevronCircleLeft className="size-5" />
                            </button>
                            <span className="text-sm">
                                Page {currentPage} of {Math.ceil(filteredReports.length / itemsPerPage)}
                            </span>
                            <button
                                disabled={currentPage === Math.ceil(filteredReports.length / itemsPerPage)}
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                                className={`px-3 py-1.5 bg-blue-500 text-white rounded-lg transition-opacity ${currentPage === Math.ceil(filteredReports.length / itemsPerPage) ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
                            >
                                <FaChevronCircleRight className="size-5" />
                            </button>
                        </div>
                    </div>

                    {/* Detailed Report View */}
                    <div className="col-span-3 bg-white dark:bg-gray-100 rounded-2xl shadow-2xl p-8">
                        {selectedReport ? (
                            <div>
                                {/* Report Header */}
                                <div className="flex justify-between items-center border-b border-gray-200 pb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-900">
                                        {selectedReport.patientName}'s Report
                                    </h2>
                                </div>

                                {/* Test Results Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <ReportSection title="Laboratory Remarks" data={selectedReport.labRemarks} />
                                    <ReportSection title="Urine Test" data={selectedReport.urineTest} />
                                    <ReportSection title="Blood Test" data={selectedReport.bloodTest} />
                                    <ReportSection title="Laboratory Tests" data={selectedReport.area1} />
                                    <ReportSection title="Renal Function" data={selectedReport.renalFunction} />
                                    <ReportSection title="Full Haemogram" data={selectedReport.fullHaemogram} />
                                    <ReportSection title="Liver Function" data={selectedReport.liverFunction} />
                                    <ReportSection title="Radiology Data" data={selectedReport.radiologyData} />
                                </div>

                                {/* Clinical Information Section */}
                                <div className="space-y-8">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-900 border-b border-gray-200 pb-4">
                                        Clinical Information
                                    </h2>

                                    {/* Vital Measurements */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-600">Height (cm)</label>
                                            <input
                                                type="number"
                                                className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={formData.height}
                                                onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-600">Weight (kg)</label>
                                            <input
                                                type="number"
                                                className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={formData.weight}
                                                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                                            />
                                        </div>
                                    </div>

                                    {/* Medical History */}
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-600">History of Past Illness</label>
                                            <input
                                                type="text"
                                                className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={formData.historyOfPastIllness}
                                                onChange={(e) => setFormData(prev => ({ ...prev, historyOfPastIllness: e.target.value }))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-600">Allergies</label>
                                            <input
                                                type="text"
                                                className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={formData.allergy}
                                                onChange={(e) => setFormData(prev => ({ ...prev, allergy: e.target.value }))}
                                            />
                                        </div>
                                    </div>

                                    {/* Examination Sections */}
                                    <div className="space-y-6">
                                        {renderExaminationSection('generalExamination', 'General Examination')}
                                        {renderExaminationSection('systemicExamination', 'Systemic Examination')}
                                        {renderExaminationSection('otherTests', 'Other Tests')}
                                    </div>

                                    {/* Clinical Notes */}
                                    <div className="space-y-4">
                                        <label className="text-sm font-medium text-gray-600">Clinical Notes</label>
                                        <textarea
                                            className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                                            value={formData.clinicalNotes}
                                            onChange={(e) => setFormData(prev => ({ ...prev, clinicalNotes: e.target.value }))}
                                        />
                                    </div>

                                    {/* Officer Information */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-600">Clinical Officer Name</label>
                                        <input
                                            type="text"
                                            className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.clinicalOfficerName}
                                            onChange={(e) => setFormData(prev => ({ ...prev, clinicalOfficerName: e.target.value }))}
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-4">
                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl text-base font-medium shadow-md transition w-full sm:w-auto"
                                        >
                                            Submit Report
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full py-12">
                                <p className="text-center text-gray-500 text-lg">Select a report to view details</p>
                            </div>
                        )}
                    </div>

                </div>

                <ToastContainer />
            </div>
        </>
    );
};

export default Clinical;