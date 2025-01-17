import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaChevronCircleLeft, FaPrint, FaChevronCircleRight, FaFileExport } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import * as XLSX from "xlsx";
import ReportSection from "../Admin/ReportSection";
import "react-toastify/dist/ReactToastify.css";
import TopBar from "../../components/TopBar";


const Agent = () => {
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

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/clinical");
                setReports(response.data);
                setFilteredReports(response.data);
                toast.success('Reports Successfully Fetched.')
                console.log(response.data);
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

    const exportToExcel = () => {
        if (!selectedReport) {
            toast.error("No report selected for export");
            return;
        }

        const exportData = [{
            id: selectedReport._id,
            patientName: selectedReport.patientName,
            labNumber: selectedReport.labNumber,
            clinicalRemarks: selectedReport.clinicalRemarks,
            date: new Date(selectedReport.timestamp).toLocaleString(),
            clinicalNotes: selectedReport.clinicalNotes,
            clinicalOfficerName: selectedReport.clinicalOfficerName,
            historyOfPastIllness: selectedReport.historyOfPastIllness,
            allergy: selectedReport.allergy
        }];

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "ClinicalReports");
        XLSX.writeFile(workbook, "ClinicalReports.xlsx");
        toast.success("Report exported to Excel");
    };

    const printReport = () => {
        if (!selectedReport) {
            toast.error("No report selected for printing");
            return;
        }

        const printContent = `
            <html>
                <head>
                    <title>Clinical Report</title>
                </head>
                <body>
                    <h1>${selectedReport.patientName}'s Clinical Report</h1>
                    <p>Lab Number: ${selectedReport.labNumber}</p>
                    <p>Date: ${new Date(selectedReport.timestamp).toLocaleString()}</p>
                    <h2>Details</h2>
                    <ul>
                        <li>Test Type: ${selectedReport.patientId}</li>
                        <li>Lab Remarks: ${selectedReport.labRemarks}</li>
                        <li>Urine Test: ${selectedReport.urineTest}</li>
                        <li>Blood Test: ${selectedReport.bloodTest}</li>
                        <li>General Examination: ${selectedReport.generalExamination}</li>
                        <li>Systemic Examination: ${selectedReport.systemicExamination}</li>
                        <li>Other Tests: ${selectedReport.otherTests}</li>
                        <li>Radiology Data: ${selectedReport.radiologyData}</li>
                        <li>Clinical Notes: ${selectedReport.clinicalNotes}</li>
                        <li>Clinical Officer Name: ${selectedReport.clinicalOfficerName}</li>
                        <li>History of Past Illness: ${selectedReport.historyOfPastIllness}</li>
                        <li>Allergy: ${selectedReport.allergy}</li>
                    </ul>
                </body>
            </html>
        `;
        const printWindow = window.open("", "", "width=800,height=600");
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    };



    const paginatedReports = filteredReports.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <>
            <TopBar />
            <div className="bg-gray-50 text-black min-h-screen transition-all duration-300">
                <div className="flex justify-between items-center p-4 bg-gray-800 text-white shadow-md">
                    <h1 className="text-2xl font-bold">Full Clinical Reports</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                    {/* Sidebar */}
                    <div className="bg-white dark:bg-gray-200 rounded-lg shadow-lg p-4 overflow-y-auto">
                        <input
                            type="text"
                            placeholder="Search by patient name or lab number"
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
                                    className={`
        relative
        p-6
        rounded-xl
        mb-4
        transition-all
        duration-300
        ease-in-out
        hover:scale-105
        border
        shadow-lg
        hover:shadow-xl
        ${selectedReport?._id === report._id
                                            ? "bg-gradient-to-br from-teal-600 to-teal-700 text-white border-teal-400"
                                            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-teal-50 dark:hover:bg-teal-900"
                                        }`}
                                >
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-teal-400 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                                            <div className="w-32 h-32 border-4 border-gray-200 dark:border-gray-600 rounded-full overflow-hidden bg-gray-50 dark:bg-gray-700 shadow-inner">
                                                {report.selectedReport.patientImage ? (
                                                    <>
                                                        <img
                                                            src={`data:image/jpeg;base64,${report.selectedReport.patientImage}`}
                                                            alt="Patient"
                                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                        />
                                                    </>
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span className="text-gray-400 dark:text-gray-500 text-3xl font-light">-</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="w-full space-y-2 text-center">
                                            <h3 className={`text-lg font-semibold tracking-wide ${selectedReport?._id === report._id
                                                ? "text-white"
                                                : "text-gray-800 dark:text-gray-200"
                                                }`}>
                                                Name: {report.selectedReport.patientName}
                                            </h3>

                                            <div className={`text-sm space-y-1 ${selectedReport?._id === report._id
                                                ? "text-teal-100"
                                                : "text-gray-600 dark:text-gray-400"
                                                }`}>
                                                <p className="flex items-center justify-center space-x-2">
                                                    <span className="font-medium">Lab Number: </span>
                                                    <span>{report.selectedReport.labNumber}</span>

                                                </p>
                                                <p className="flex items-center justify-center space-x-2">
                                                    <span className="font-medium">Date: </span>
                                                    <span>{new Date(report.selectedReport.timeStamp).toLocaleString()}</span>
                                                </p>
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
                                onClick={() => setCurrentPage(currentPage - 1)}
                                className="bg-teal-500 text-white p-2 rounded-md hover:bg-teal-600 disabled:opacity-50"
                            >
                                <FaChevronCircleLeft />
                            </button>
                            <div className="text-center">
                                Page {currentPage} of {Math.ceil(filteredReports.length / itemsPerPage)}
                            </div>
                            <button
                                disabled={currentPage === Math.ceil(filteredReports.length / itemsPerPage)}
                                onClick={() => setCurrentPage(currentPage + 1)}
                                className="bg-teal-500 text-white p-2 rounded-md hover:bg-teal-600 disabled:opacity-50"
                            >
                                <FaChevronCircleRight />
                            </button>
                        </div>
                    </div>

                    {/* Report Details */}
                    <div className="col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
                        {selectedReport ? (
                            <div className="space-y-8">
                                <div className="mb-6">
                                    <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">Full Report Details</h2>
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 space-y-6">
                                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">{selectedReport.selectedReport.patientName}' Details</h2>
                                        <div className="mt-8 flex justify-end space-x-6">
                                            <button
                                                onClick={printReport}
                                                className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-all duration-200"
                                            >
                                                <FaPrint className="mr-2" />
                                                Print
                                            </button>
                                            <button
                                                onClick={exportToExcel}
                                                className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-all duration-200"
                                            >
                                                <FaFileExport className="mr-2" />
                                                Export to Excel
                                            </button>
                                        </div>

                                        {/* Patient Information */}
                                        <div className="p-5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                                            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">Patient Information</h3>
                                            <p className="text-lg text-gray-800 dark:text-gray-200"><strong>Name:</strong> {selectedReport.selectedReport.patientName || "Not Available"}</p>
                                            <p className="text-lg text-gray-800 dark:text-gray-200"><strong>Lab Number:</strong> {selectedReport.selectedReport.labNumber || "Not Available"}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <ReportSection title="Lab Remarks" data={selectedReport.selectedReport.labRemarks} />
                                        <ReportSection title="Laboratory Remarks" data={selectedReport.selectedReport.labRemarks} />
                                        <ReportSection title="Urine Test" data={selectedReport.selectedReport.urineTest} />
                                        <ReportSection title="Blood Test" data={selectedReport.selectedReport.bloodTest} />
                                        <ReportSection title="General Examination" data={selectedReport.generalExamination} />
                                        <ReportSection title="Systemic Examination" data={selectedReport.systemicExamination} />
                                        <ReportSection title="Other Tests" data={selectedReport.otherTests} />
                                        <ReportSection title="Laboratory Tests" data={selectedReport.selectedReport.area1} />
                                        <ReportSection title="Renal Function" data={selectedReport.selectedReport.renalFunction} />
                                        <ReportSection title="Full Haemogram" data={selectedReport.selectedReport.fullHaemogram} />
                                        <ReportSection title="Liver Function" data={selectedReport.selectedReport.liverFunction} />
                                        <ReportSection title="Radiology Data" data={selectedReport.radiologyData} />
                                    </div>

                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 space-y-6 text-center">
                                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">More Clinical Details</h2>
                                        <div className="grid grid-cols-3 sm:grid-cols-2 gap-6">
                                            <div className="p-6 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                                                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Height</h3>
                                                <p className="text-l font-medium text-gray-800 dark:text-gray-100">
                                                    {selectedReport.height || "Not Available"}cm
                                                </p>
                                            </div>
                                            <div className="p-6 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                                                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Weight</h3>
                                                <p className="text-l font-medium text-gray-800 dark:text-gray-100">
                                                    {selectedReport.weight || "Not Available"}kg
                                                </p>
                                            </div>
                                            <div className="p-6 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                                                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Clinical Notes</h3>
                                                <p className="text-l font-medium text-gray-800 dark:text-gray-100">
                                                    {selectedReport.clinicalNotes || "Not Available"}
                                                </p>
                                            </div>
                                            <div className="p-6 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                                                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Clinical Officer Name</h3>
                                                <p className="text-l font-medium text-gray-800 dark:text-gray-100">
                                                    {selectedReport.clinicalOfficerName || "Not Available"}
                                                </p>
                                            </div>
                                            <div className="p-6 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                                                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">History of Past Illness</h3>
                                                <p className="text-l font-medium text-gray-800 dark:text-gray-100">
                                                    {selectedReport.historyOfPastIllness || "Not Available"}
                                                </p>
                                            </div>
                                            <div className="p-6 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                                                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Allergy</h3>
                                                <p className="text-l font-medium text-gray-800 dark:text-gray-100">
                                                    {selectedReport.allergy || "Not Available"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <p className="text-center text-gray-500">Select a report to view details</p>
                        )}
                    </div>

                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default Agent;
