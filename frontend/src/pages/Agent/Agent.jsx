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

        // Create a more comprehensive dataset for export
        const exportData = [{
            'Patient Name': selectedReport.patientName || 'N/A',
            'Lab Number': selectedReport.labNumber || 'N/A',
            'Date': new Date(selectedReport.timestamp).toLocaleString(),
            'Height (cm)': selectedReport.height || 'N/A',
            'Weight (kg)': selectedReport.weight || 'N/A',
            'Clinical Officer': selectedReport.clinicalOfficerName || 'N/A',
            'Clinical Notes': selectedReport.clinicalNotes || 'N/A',
            'History of Past Illness': selectedReport.historyOfPastIllness || 'N/A',
            'Allergies': selectedReport.allergy || 'N/A',
            'General Examination': selectedReport.generalExamination || 'N/A',
            'Systemic Examination': selectedReport.systemicExamination || 'N/A',
            'Blood Test Results': selectedReport.bloodTest || 'N/A',
            'Urine Test Results': selectedReport.urineTest || 'N/A',
            'Other Tests': selectedReport.otherTests || 'N/A',
            'Lab Remarks': selectedReport.labRemarks || 'N/A',
            'Renal Function': selectedReport.renalFunction || 'N/A',
            'Full Haemogram': selectedReport.fullHaemogram || 'N/A',
            'Liver Function': selectedReport.liverFunction || 'N/A',
            'Radiology Data': selectedReport.radiologyData || 'N/A'
        }];

        // Configure worksheet options for better formatting
        const ws = XLSX.utils.json_to_sheet(exportData, {
            header: Object.keys(exportData[0]),
            skipHeader: false
        });

        // Set column widths
        const colWidths = Object.keys(exportData[0]).map(() => ({ wch: 30 }));
        ws['!cols'] = colWidths;

        // Create workbook and append worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Clinical Report");

        // Generate filename with patient name and date
        const filename = `Clinical_Report_${selectedReport.patientName}_${new Date().toISOString().split('T')[0]}.xlsx`;

        // Write file and download
        XLSX.writeFile(wb, filename);
        toast.success("Report exported successfully");
    };

    const printReport = () => {
        if (!selectedReport) {
            toast.error("No report selected for printing");
            return;
        }

        const printStyles = `
            <style>
                @media print {
                    @page { 
                        margin: 2cm;
                        size: A4;
                    }
                    body {
                        font-family: 'Arial', sans-serif;
                        line-height: 1.6;
                        color: #333;
                    }
                    .report-container {
                        max-width: 100%;
                        margin: 0 auto;
                    }
                    .header {
                        text-align: center;
                        padding-bottom: 20px;
                        border-bottom: 2px solid #2dd4bf;
                        margin-bottom: 30px;
                    }
                    .report-title {
                        font-size: 24px;
                        font-weight: bold;
                        color: #0f766e;
                        margin: 10px 0;
                    }
                    .section {
                        margin-bottom: 25px;
                        page-break-inside: avoid;
                    }
                    .section-title {
                        font-size: 18px;
                        font-weight: bold;
                        color: #0f766e;
                        margin-bottom: 10px;
                        padding-bottom: 5px;
                        border-bottom: 1px solid #e2e8f0;
                    }
                    .subsection-title {
                        font-size: 16px;
                        font-weight: 600;
                        color: #1f2937;
                        margin: 15px 0 10px 0;
                    }
                    .section-content {
                        background-color: #f8fafc;
                        padding: 15px;
                        border-radius: 8px;
                        margin-bottom: 15px;
                    }
                    .data-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 15px;
                        margin-bottom: 15px;
                    }
                    .data-item {
                        padding: 10px;
                        background-color: white;
                        border: 1px solid #e2e8f0;
                        border-radius: 4px;
                    }
                    .test-result {
                        display: grid;
                        grid-template-columns: 2fr 1fr 1fr 1fr;
                        gap: 10px;
                        padding: 8px;
                        border-bottom: 1px solid #e2e8f0;
                    }
                    .test-result:last-child {
                        border-bottom: none;
                    }
                    .test-header {
                        font-weight: bold;
                        background-color: #f1f5f9;
                        padding: 8px;
                    }
                    .label {
                        font-weight: bold;
                        color: #1f2937;
                    }
                    .value {
                        color: #4b5563;
                    }
                    .footer {
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #2dd4bf;
                        text-align: center;
                        font-size: 12px;
                        color: #64748b;
                    }
                }
            </style>
        `;

        const formatData = (data) => {
            return data || 'Not Available';
        };

        const renderTestResult = (test) => {
            if (!test) return '';
            const { value, units, status, range } = test;
            return `
                <div class="test-result">
                    <span class="value">${formatData(value)}</span>
                    <span class="value">${formatData(units)}</span>
                    <span class="value">${formatData(status)}</span>
                    <span class="value">${formatData(range)}</span>
                </div>
            `;
        };

        const printContent = `
            <html>
                <head>
                    <title>Clinical Report - ${formatData(selectedReport.selectedReport.patientName)}</title>
                    ${printStyles}
                </head>
                <body>
                    <div class="report-container">
                        <div class="header">
                            <h1 class="report-title">Full Clinical Report</h1>
                            <div>
<img 
  src="data:image/jpeg;base64,${selectedReport.selectedReport.patientImage}" 
  alt="img" 
  style="width: 100px; height: 100px;">

                            </div>
                            <p>Date: ${new Date(selectedReport.selectedReport.timeStamp).toLocaleString()}</p>
                            <p>Lab Number: ${formatData(selectedReport.selectedReport.labNumber)}</p>
                        </div>
    
                        <div class="section">
                            <h2 class="section-title">Patient Information</h2>
                            <div class="section-content">
                                <div class="data-grid">
                                    <div class="data-item">
                                        <span class="label">Patient Name:</span>
                                        <span class="value">${formatData(selectedReport.selectedReport.patientName)}</span>
                                    </div>
                                    <div class="data-item">
                                        <span class="label">Height:</span>
                                        <span class="value">${formatData(selectedReport.height)}</span>
                                    </div>
                                    <div class="data-item">
                                        <span class="label">Weight:</span>
                                        <span class="value">${formatData(selectedReport.weight)}</span>
                                    </div>
                                    <div class="data-item">
                                        <span class="label">Clinical Officer:</span>
                                        <span class="value">${formatData(selectedReport.clinicalOfficerName)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        <div class="section">
                            <h2 class="section-title">Clinical Information</h2>
                            <div class="section-content">
                                <div class="data-grid">
                                    <div class="data-item">
                                        <span class="label">Clinical Notes:</span>
                                        <span class="value">${formatData(selectedReport.clinicalNotes)}</span>
                                    </div>
                                    <div class="data-item">
                                        <span class="label">History of Past Illness:</span>
                                        <span class="value">${formatData(selectedReport.historyOfPastIllness)}</span>
                                    </div>
                                    <div class="data-item">
                                        <span class="label">Allergy:</span>
                                        <span class="value">${formatData(selectedReport.allergy)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        <div class="section">
                            <h2 class="section-title">General Examination</h2>
                            <div class="section-content">
                                <div class="data-grid">
                                    <div class="data-item">
                                        <span class="label">Left Eye:</span>
                                        <span class="value">${formatData(selectedReport.generalExamination?.leftEye)}</span>
                                    </div>
                                    <div class="data-item">
                                        <span class="label">Right Eye:</span>
                                        <span class="value">${formatData(selectedReport.generalExamination?.rightEye)}</span>
                                    </div>
                                    <div class="data-item">
                                        <span class="label">Hernia:</span>
                                        <span class="value">${formatData(selectedReport.generalExamination?.hernia)}</span>
                                    </div>
                                    <div class="data-item">
                                        <span class="label">Varicose Vein:</span>
                                        <span class="value">${formatData(selectedReport.generalExamination?.varicoseVein)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        <div class="section">
                            <h2 class="section-title">Systemic Examination</h2>
                            <div class="section-content">
                                <div class="data-grid">
                                    <div class="data-item">
                                        <span class="label">Blood Pressure:</span>
                                        <span class="value">${formatData(selectedReport.systemicExamination?.bloodPressure)}</span>
                                    </div>
                                    <div class="data-item">
                                        <span class="label">Heart:</span>
                                        <span class="value">${formatData(selectedReport.systemicExamination?.heart)}</span>
                                    </div>
                                    <div class="data-item">
                                        <span class="label">Pulse Rate:</span>
                                        <span class="value">${formatData(selectedReport.systemicExamination?.pulseRate)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        <div class="section">
                            <h2 class="section-title">Laboratory Tests</h2>
                            <div class="section-content">
                                <h3 class="subsection-title">Area 1 Tests</h3>
                                <div class="data-grid">
                                    <div class="data-item">
                                        <span class="label">Blood Group:</span>
                                        <span class="value">${formatData(selectedReport.selectedReport.area1?.bloodGroup)}</span>
                                    </div>
                                    <div class="data-item">
                                        <span class="label">Pregnancy Test:</span>
                                        <span class="value">${formatData(selectedReport.selectedReport.area1?.pregnancyTest)}</span>
                                    </div>
                                    <div class="data-item">
                                        <span class="label">VDRL Test:</span>
                                        <span class="value">${formatData(selectedReport.selectedReport.area1?.vdrlTest)}</span>
                                    </div>
                                </div>
    
                                <h3 class="subsection-title">Blood Tests</h3>
                                <div class="data-grid">
                                    <div class="data-item">
                                        <span class="label">ESR:</span>
                                        <span class="value">${formatData(selectedReport.selectedReport.bloodTest?.esr)}</span>
                                    </div>
                                    <div class="data-item">
                                        <span class="label">HBsAg:</span>
                                        <span class="value">${formatData(selectedReport.selectedReport.bloodTest?.hbsAg)}</span>
                                    </div>
                                    <div class="data-item">
                                        <span class="label">HCV:</span>
                                        <span class="value">${formatData(selectedReport.selectedReport.bloodTest?.hcv)}</span>
                                    </div>
                                    <div class="data-item">
                                        <span class="label">HIV Test:</span>
                                        <span class="value">${formatData(selectedReport.selectedReport.bloodTest?.hivTest)}</span>
                                    </div>
                                </div>
    
                                <h3 class="subsection-title">Full Haemogram</h3>
                                <div class="test-header test-result">
                                    <span>Parameter</span>
                                    <span>Value</span>
                                    <span>Status</span>
                                    <span>Range</span>
                                </div>
                                ${renderTestResult(selectedReport.selectedReport.fullHaemogram?.wbc)}
                                ${renderTestResult(selectedReport.selectedReport.fullHaemogram?.rbc)}
                                ${renderTestResult(selectedReport.selectedReport.fullHaemogram?.hgb)}
                                ${renderTestResult(selectedReport.selectedReport.fullHaemogram?.hct)}
                                ${renderTestResult(selectedReport.selectedReport.fullHaemogram?.mcv)}
                                ${renderTestResult(selectedReport.selectedReport.fullHaemogram?.mch)}
                                ${renderTestResult(selectedReport.selectedReport.fullHaemogram?.mchc)}
                                ${renderTestResult(selectedReport.selectedReport.fullHaemogram?.plt)}
                                ${renderTestResult(selectedReport.selectedReport.fullHaemogram?.lym)}
                                ${renderTestResult(selectedReport.selectedReport.fullHaemogram?.mid)}
                                ${renderTestResult(selectedReport.selectedReport.fullHaemogram?.gran)}
                                ${renderTestResult(selectedReport.selectedReport.fullHaemogram?.mpv)}
                                ${renderTestResult(selectedReport.selectedReport.fullHaemogram?.pdw)}
                                ${renderTestResult(selectedReport.selectedReport.fullHaemogram?.pct)}
                                ${renderTestResult(selectedReport.selectedReport.fullHaemogram?.plcr)}
                            </div>
                        </div>
    
                        <div class="section">
                            <h2 class="section-title">Urine Test</h2>
                            <div class="section-content">
                                <div class="data-grid">
                                    <div class="data-item">
                                        <span class="label">Albumin:</span>
                                        <span class="value">${formatData(selectedReport.selectedReport.urineTest?.albumin)}</span>
                                    </div>
                                    <div class="data-item">
                                        <span class="label">Sugar:</span>
                                        <span class="value">${formatData(selectedReport.selectedReport.urineTest?.sugar)}</span>
                                    </div>
                                    <div class="data-item">
                                        <span class="label">Reaction:</span>
                                        <span class="value">${formatData(selectedReport.selectedReport.urineTest?.reaction)}</span>
                                    </div>
                                    <div class="data-item">
                                        <span class="label">Microscopic:</span>
                                        <span class="value">${formatData(selectedReport.selectedReport.urineTest?.microscopic)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        <div class="section">
                            <h2 class="section-title">Lab Remarks</h2>
                            <div class="section-content">
                                <div class="data-grid">
                                    <div class="data-item">
                                        <span class="label">Fitness Evaluation - Overall Status:</span>
                                        <span class="value">${formatData(selectedReport.selectedReport.labRemarks?.fitnessEvaluation?.overallStatus)}</span>
                                    </div>
                                    <div class="data-item">
                                        <span class="label">Other Aspects Fit:</span>
                                        <span class="value">${formatData(selectedReport.selectedReport.labRemarks?.fitnessEvaluation?.otherAspectsFit)}</span>
                                    </div>
                                    <div class="data-item">
                                        <span class="label">Lab Superintendent:</span>
                                        <span class="value">${formatData(selectedReport.selectedReport.labRemarks?.labSuperintendent?.name)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        <div class="footer">
                            <p>This is a computer-generated report. No signature required.</p>
                            <p>Report generated on: ${new Date().toLocaleString()}</p>
                        </div>
                    </div>
                </body>
            </html>
        `;

        const printWindow = window.open("", "", "width=800,height=600");
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.onload = () => {
            printWindow.print();
            printWindow.onafterprint = () => {
                printWindow.close();
            };
        };
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
                                           {/*
                                            <button
                                                onClick={exportToExcel}
                                                className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-all duration-200"
                                            >
                                                <FaFileExport className="mr-2" />
                                                Export to Excel
                                            </button>
                                            */}
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
