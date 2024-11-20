import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AiFillDelete, AiOutlinePrinter } from 'react-icons/ai';
import { FaFileExport, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import * as XLSX from 'xlsx';
import ReportSection from './ReportSection';

const Card = ({ children, className }) => (
  <div className={`bg-white rounded-lg shadow-lg ${className}`}>{children}</div>
);

const CardHeader = ({ children }) => (
  <div className="px-6 py-4 border-b border-gray-200">{children}</div>
);

const CardTitle = ({ children }) => (
  <h2 className="text-2xl font-bold text-gray-800">{children}</h2>
);

const CardContent = ({ children }) => (
  <div className="p-6">{children}</div>
);

const Spinner = ({ size = 'md' }) => (
  <div className={`border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin ${size === 'lg' ? 'w-10 h-10' : 'w-6 h-6'}`} />
);

const LabReports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed,setIsCollapsed] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/lab');
        setReports(response.data.data);
        setFilteredReports(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching reports:', error);
        toast.error('Error Fetching Reports');
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    const filtered = reports.filter((report) =>
      (report.patientName && report.patientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (report.name && report.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredReports(filtered);
  }, [reports, searchTerm]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/labs/${id}`);
      setReports(reports.filter((report) => report._id !== id));
      toast.success('Report deleted successfully');
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Error deleting report');
    }
  };

  const exportToExcel = () => {
    // Prepare data for export by removing unnecessary fields and flattening nested objects
    const exportData = filteredReports.map(report => {
      const flatReport = {
        patientId: report._id,
        patientName: report.patientName,
        name: report.name,
        timestamp: new Date(report.timeStamp).toLocaleString(),
        ...Object.entries(report).reduce((acc, [key, value]) => {
          if (typeof value === 'object' && value !== null) {
            Object.entries(value).forEach(([subKey, subValue]) => {
              if (typeof subValue === 'object' && subValue !== null) {
                acc[`${key}_${subKey}`] = subValue.value;
                acc[`${key}_${subKey}_status`] = subValue.status;
                acc[`${key}_${subKey}_range`] = subValue.range;
              } else {
                acc[`${key}_${subKey}`] = subValue;
              }
            });
          }
          return acc;
        }, {})
      };
      return flatReport;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');
    XLSX.writeFile(workbook, 'LabReports.xlsx');
    toast.success('Reports exported to Excel');
  };

  const handlePrint = () => {
    const printContents = document.getElementById('printable-section').innerHTML;
    const printWindow = window.open('', '', 'width=1000,height=800');
  
    if (!printContents) {
      toast.error('No content found to print');
      return;
    }
  
    // Display a loading indicator while preparing the print content
    const loadingHtml = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif; font-size: 24px; color: #1e40af;">
        Preparing your report...
      </div>`;
    
    printWindow.document.write(loadingHtml);
  
    // Set a slight delay to ensure the loading message appears
    setTimeout(() => {
      printWindow.document.write(`
        <html>
          <head>
            <title>Enhanced Laboratory Report</title>
            <style>
              /* General Reset and Base Styles */
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
  
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #1f2937;
                padding: 2rem;
                background-color: #fafafa;
              }
  
              /* Header Styles */
              .report-header {
                text-align: center;
                margin-bottom: 2rem;
                padding-bottom: 1rem;
                border-bottom: 3px solid #3b82f6;
              }
  
              .report-header h1 {
                font-size: 28px;
                color: #1e40af;
                margin-bottom: 0.5rem;
              }
  
              .report-header .timestamp {
                color: #6b7280;
                font-size: 14px;
              }
  
              /* Report Card Styles */
              .report-card {
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                margin: 2rem 0;
                padding: 1.5rem;
                background: #ffffff;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                page-break-inside: avoid;
              }
  
              .patient-info {
                margin-bottom: 1.5rem;
                padding-bottom: 1rem;
                border-bottom: 2px solid #e5e7eb;
              }
  
              .patient-info h2 {
                color: #1e40af;
                font-size: 20px;
                margin-bottom: 0.5rem;
              }
  
              .patient-info p {
                color: #4b5563;
                font-size: 14px;
                margin: 0.25rem 0;
              }
  
              /* Section Styles */
              .section {
                margin: 1rem 0;
                padding: 1rem;
                background: #f3f4f6;
                border-radius: 8px;
                border: 1px solid #d1d5db;
              }
  
              .section-title {
                color: #1e40af;
                font-size: 18px;
                font-weight: 600;
                padding-bottom: 0.5rem;
                margin-bottom: 1rem;
                border-bottom: 2px solid #93c5fd;
              }
  
              .data-row {
                display: flex;
                justify-content: space-between;
                margin: 0.5rem 0;
                padding: 0.5rem 0;
                border-bottom: 1px solid #e5e7eb;
              }
  
              .data-label {
                font-weight: 500;
                color: #374151;
                min-width: 200px;
              }
  
              .data-value {
                color: #1f2937;
              }
  
              /* Status Badges */
              .status-badge {
                display: inline-block;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
                margin-left: 8px;
              }
  
              .status-normal {
                background: #d1fae5;
                color: #065f46;
              }
  
              .status-high {
                background: #fee2e2;
                color: #b91c1c;
              }
  
              .status-low {
                background: #fef3c7;
                color: #92400e;
              }
  
              /* Page Break Controls */
              @media print {
                .report-card {
                  break-inside: avoid;
                  margin: 0;
                  padding: 1.5rem 0;
                }
  
                .section {
                  break-inside: avoid;
                }
  
                @page {
                  margin: 1.5cm;
                }
              }
  
              /* Footer Styles */
              .report-footer {
                margin-top: 2rem;
                padding-top: 1rem;
                border-top: 2px solid #e5e7eb;
                text-align: center;
                font-size: 12px;
                color: #6b7280;
              }
  
              /* Animation for Loading */
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
  
              .fade-in {
                animation: fadeIn 1s ease-in-out;
              }
            </style>
          </head>
          <body class="fade-in">
            <div class="report-header">
              <h1>Enhanced Laboratory Report</h1>
              <div class="timestamp">Generated on ${new Date().toLocaleString()}</div>
            </div>
            ${printContents}
            <div class="report-footer">
              <p>This is an official laboratory report document</p>
              <p>Generated by Laboratory Management System</p>
            </div>
          </body>
        </html>
      `);
  
      printWindow.document.close();
  
      // Wait for all content to load before printing
      printWindow.onload = function() {
        setTimeout(() => {
          printWindow.print();
          toast.success('Reports printed successfully');
        }, 500);
      };
  
      // Handle print errors
      printWindow.onerror = function() {
        toast.error('Error occurred while printing');
        printWindow.close();
      };
    }, 300); // Delay to show loading screen
  };
  

  return (
    <div className="mt-20 mx-auto p-6 bg-gray-50 min-h-screen">
      <Card className="max-w-11/12 mx-auto">
        <CardHeader>
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <CardTitle>LABORATORY REPORTS</CardTitle>
              <div className="flex items-center space-x-2">
                <button
                  onClick={exportToExcel}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
                >
                  <FaFileExport className="mr-2" /> Export Filtered
                </button>
                <button
                  onClick={handlePrint}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
                >
                  <AiOutlinePrinter className="mr-2" /> Print Filtered
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="Search by patient name"
                className="border border-gray-300 rounded-lg px-4 py-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <div id="printable-section" className="grid grid-cols-1 gap-6">
              {filteredReports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No reports found matching your search criteria
                </div>
              ) : (
                filteredReports.map((report) => (
                  <Card key={report._id} className="border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <p className="text-gray-600">ID: {report._id}</p>
                          <p className="text-blue-600 font-semibold text-[16px]">Name: {report.patientName || name}</p>
                          <p className="text-gray-600">
                            Date: {new Date(report.timeStamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="ml-28 cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>
                          {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                        </div>
                        <button
                          onClick={() => handleDelete(report._id)}
                          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
                        >
                          <AiFillDelete className="mr-2" /> Delete
                        </button>
                      </div>
                    </CardHeader>
                    {!isCollapsed && (
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ReportSection title="Laboratory Remarks" data={report.labRemarks} />
                        <ReportSection title="Urine Test" data={report.urineTest} />
                        <ReportSection title="Blood Test" data={report.bloodTest} />
                        <ReportSection title="General Examination" data={report.generalExamination} />
                        <ReportSection title="Systemic Examination" data={report.systemicExamination} />
                        <ReportSection title="Area 1" data={report.area1} />
                        <ReportSection title="Renal Function" data={report.renalFunction} />
                        <ReportSection title="Full Haemogram" data={report.fullHaemogram} />
                        <ReportSection title="Liver Function" data={report.liverFunction} />
                      </div>
                    </CardContent>
                    )}
                  </Card>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default LabReports;