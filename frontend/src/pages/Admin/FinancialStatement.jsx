import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import 'react-toastify/dist/ReactToastify.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const FinancialStatements = () => {
  const [paymentRecords, setPaymentRecords] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(null); // State to manage errors

  useEffect(() => {
    const fetchPaymentRecords = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/patient/account/:id');
        console.log('Payment records:', response.data);
        setPaymentRecords(response.data);
      } catch (error) {
        console.error('Error fetching payment records:', error.response || error.message);
        setError(error.response?.data?.message || error.message || 'Unknown error');
        toast.error(`Error fetching payment records: ${error.response?.data?.message || error.message || 'Unknown error'}`);
      } finally {
        setLoading(false); // Set loading to false after the API call
      }
    };

    fetchPaymentRecords();
  }, []);

  const calculateChartData = () => {
    const paidCount = paymentRecords.filter(record => record.paymentStatus === 'Paid').length;
    const pendingCount = paymentRecords.filter(record => record.paymentStatus === 'Pending').length;
    return {
      labels: ['Paid', 'Pending'],
      datasets: [
        {
          data: [paidCount, pendingCount],
          backgroundColor: ['#4CAF50', '#FF5733'],
        }
      ],
    };
  };

  const exportToExcel = () => {
    const sheetData = paymentRecords.map(record => ({
      PatientName: record.patientName,
      AmountDue: record.amountDue,
      AmountPaid: record.amountPaid,
      AccountNumber: record.accountNumber,
      PaymentStatus: record.paymentStatus,
      Date: record.paymentDate,
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Financial Statements');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'FinancialStatements.xlsx');
  };

  // Optional: Render loading state or error message
  if (loading) {
    return <div className="text-center text-lg">Loading payment records...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-600">Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-100 shadow-lg rounded-lg">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Financial Statements</h1>

      {/* Chart Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold text-center mb-4 text-blue-500">Payment Status</h2>
          <Doughnut data={calculateChartData()} />
        </div>

        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold text-center mb-4 text-blue-500">Payment Distribution</h2>
          <Bar
            data={{
              labels: paymentRecords.map(record => record.patientName),
              datasets: [
                {
                  label: 'Amount Due',
                  data: paymentRecords.map(record => record.amountDue),
                  backgroundColor: '#FF6347',
                },
                {
                  label: 'Amount Paid',
                  data: paymentRecords.map(record => record.amountPaid),
                  backgroundColor: '#4CAF50',
                }
              ],
            }}
            options={{ responsive: true }}
          />
        </div>
      </div>

      {/* Payment Records Table */}
      <div className="bg-white p-6 shadow-lg rounded-lg mb-8 overflow-x-auto">
        <h2 className="text-xl font-semibold text-center mb-4 text-blue-500">Payment Details</h2>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 text-left text-gray-600 font-semibold">Patient Name</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left text-gray-600 font-semibold">Amount Due</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left text-gray-600 font-semibold">Amount Paid</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left text-gray-600 font-semibold">Account Number</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left text-gray-600 font-semibold">Payment Status</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left text-gray-600 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {paymentRecords.map((record, index) => (
              <tr key={index} className="hover:bg-gray-50 transition duration-200">
                <td className="py-2 px-4 border-b border-gray-200">{record.patientName}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-right">sh {record.amountDue}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-right">sh {record.amountPaid}</td>
                <td className="py-2 px-4 border-b border-gray-200">{record.accountNumber}</td>
                <td className={`py-2 px-4 border-b border-gray-200 ${record.paymentStatus === 'Paid' ? 'text-green-500' : 'text-red-500'}`}>{record.paymentStatus}</td>
                <td className="py-2 px-4 border-b border-gray-200">{record.paymentDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Export Button */}
      <button
        onClick={exportToExcel}
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
      >
        Export Data to Excel
      </button>
    </div>
  );
};

export default FinancialStatements;
