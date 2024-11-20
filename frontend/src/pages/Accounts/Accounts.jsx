import React, { useState, useEffect, useRef } from 'react';
import { usePatient } from '../../context/patientContext';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import ReactToPrint from 'react-to-print';
import { QRCodeCanvas } from 'qrcode.react';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from '../../components/TopBar';
import logo from '../../assets/GULF HEALTHCARE KENYA LTD.png';
import LeftBar from '../../components/LeftBar';
import Footer from '../../components/Footer'

const Accounts = () => {
  const { patientData, updatePatientData } = usePatient();
  const [amountDue, setAmountDue] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [paymentRecords, setPaymentRecords] = useState([]);
  const [currentRecord, setCurrentRecord] = useState(null);
  const componentRef = useRef();

  useEffect(() => {
    const fetchPaymentRecords = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/patient/account/id');
        console.log('Payment records:', response.data);
        setPaymentRecords(response.data);
      } catch (error) {
        console.error('Error fetching payment records:', error);
        toast.error('Error fetching payment records. Please try again.');
      }
    };

    fetchPaymentRecords();

    if (patientData && patientData.personalDetails) {
      setSelectedPatient(patientData.personalDetails.name);
      setAmountDue(parseFloat(patientData.amountDue || 0).toFixed(2));
      setAmountPaid(parseFloat(patientData.amountPaid || 0).toFixed(2));
    }
  }, [patientData]);

  useEffect(() => {
    if (currentRecord) {
      setAmountDue(currentRecord.amountDue || '');
      setAmountPaid(currentRecord.amountPaid || '');
      setAccountNumber(currentRecord.accountNumber || '');
    } else {
      resetForm();
    }
  }, [currentRecord]);

  const handlePaymentSubmit = async () => {
    if (!amountDue || !amountPaid || !accountNumber) {
      toast.error('Please enter Amount Due, Amount Paid, and Account Number.');
      return;
    }

    const newPayment = {
      patientName: selectedPatient,
      amountDue: parseFloat(amountDue),
      amountPaid: parseFloat(amountPaid),
      accountNumber: accountNumber,
      paymentStatus: parseFloat(amountPaid) >= parseFloat(amountDue) ? 'Paid' : 'Pending',
      date: new Date().toLocaleDateString(),
    };

    try {
      const response = await axios.post('http://localhost:5000/api/patient/account', newPayment);
      const savedPayment = response.data;

      toast.success(`Payment recorded: Due - ${amountDue}, Paid - ${amountPaid}, Account - ${accountNumber}`);
      setPaymentRecords([...paymentRecords, savedPayment]);
      updatePatientData({
        amountDue: parseFloat(amountDue),
        amountPaid: parseFloat(amountPaid),
        paymentStatus: savedPayment.paymentStatus,
      });
      resetForm();
    } catch (error) {
      toast.error('Error recording payment. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error('ID is undefined. Cannot proceed with deletion.');
      toast.error('ID is undefined. Cannot proceed with deletion.');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this payment record?');
    if (!confirmDelete) return; // Prevent accidental deletion
  
    try {
      await axios.delete(`http://localhost:5000/api/patient/account/${id}`);
      setPaymentRecords(paymentRecords.filter((record) => record.id !== id));
      toast.success('Payment record deleted successfully.');
    } catch (error) {
      console.error('Error deleting payment record:', error);
      toast.error('Error deleting payment record. Please try again.');
    }
  };

  const handleUpdate = (record) => {
    setCurrentRecord(record);
    setAmountDue(record.amountDue || '');
    setAmountPaid(record.amountPaid || '');
    setAccountNumber(record.accountNumber || '');
  };

  const handleUpdateSubmit = async () => {
    if (!amountDue || !amountPaid || !accountNumber) {
      toast.error('Please enter Amount Due, Amount Paid, and Account Number.');
      return;
    }
  
    if (parseFloat(amountDue) < 0 || parseFloat(amountPaid) < 0) {
      toast.error('Amounts cannot be negative.');
      return;
    }
  
    const updatedPayment = {
      ...currentRecord,
      amountDue: parseFloat(amountDue),
      amountPaid: parseFloat(amountPaid),
      accountNumber: accountNumber,
      paymentStatus: parseFloat(amountPaid) >= parseFloat(amountDue) ? 'Paid' : 'Pending',
    };
  
    try {
      await axios.put(`http://localhost:5000/api/patient/account/${currentRecord._id}`, updatedPayment);
      setPaymentRecords(paymentRecords.map(record => 
        record._id === currentRecord._id ? updatedPayment : record
      ));
      toast.success('Payment record updated successfully.');
      resetForm(); // Reset the form after update
    } catch (error) {
      console.error('Error updating payment record:', error);
      toast.error('Error updating payment record. Please try again.');
    }
  };
  
  const resetForm = () => {
    setAmountDue('');
    setAmountPaid('');
    setAccountNumber('');
    setCurrentRecord(null);
  };

  return (
    <>
    <TopBar/>
    <div className='flex'>
      <LeftBar/>

    <div className="max-w-7xl mx-auto bg-gray-50 p-8 shadow-lg rounded-lg">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Accounts Office</h1>
      {patientData ? (
        <>
          <p className="text-lg text-gray-700 mb-4">
            Patient Name: <span className="font-semibold">{selectedPatient || 'No data'}</span>
          </p>

          {/* Input Fields */}
          <div className="mb-4">
            <label className="block text-gray-600 font-semibold mb-2" htmlFor="patientSelect">Select Patient</label>
            <select
              id="patientSelect"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              disabled={!patientData.patients || patientData.patients.length === 0}
            >
              {patientData.patients.length > 0 ? (
                patientData.patients.map((patient) => (
                  <option key={patient.labNumber} value={patient.name}>
                    {patient.name}
                  </option>
                ))
              ) : (
                <option>No patients available</option>
              )}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 font-semibold mb-2" htmlFor="accountNumber">Account Number</label>
            <input
              type="text"
              id="accountNumber"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter account number"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 font-semibold mb-2" htmlFor="amountDue">Amount Due</label>
            <input
              type="number"
              id="amountDue"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              value={amountDue}
              onChange={(e) => setAmountDue(e.target.value)}
              placeholder="Enter amount due"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 font-semibold mb-2" htmlFor="amountPaid">Amount Paid</label>
            <input
              type="number"
              id="amountPaid"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              placeholder="Enter amount paid"
            />
          </div>

          <button
            onClick={currentRecord ? handleUpdateSubmit : handlePaymentSubmit}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
          >
            {currentRecord ? 'Update Payment' : 'Record Payment'}
          </button>

          {/* Payment Records Table */}
          <div className="mt-6 overflow-auto">
            <h2 className="text-xl font-semibold mb-4">Payment Records</h2>
            {paymentRecords.length > 0 ? (
              <div>
                <ReactToPrint
                  trigger={() => (
                    <button className="bg-green-500 text-white font-semibold mb-4 py-1 px-2 rounded hover:bg-green-600 transition">
                      Print Records
                    </button>
                  )}
                  content={() => componentRef.current}
                />
                <div ref={componentRef} className="printable">
                  <style>
                    {`
                      @media print {
                        .printable {
                          margin: 0;
                          padding: 0;
                          background: white;
                          color: black;
                          box-shadow: none;
                          page-break-after: always;
                        }
                        .printable h1, .printable h2 {
                          text-align: center;
                        }
                        .printable table {
                          width: 100%;
                          border-collapse: collapse;
                        }
                        .printable th, .printable td {
                          border: 1px solid #ccc;
                          padding: 8px;
                          text-align: left;
                        }
                      }
                    `}
                  </style>
                  <header className="mb-4">
                    <img src={logo} alt="Logo" className="w-65 mx-auto" />
                    <h1 className="text-xl font-bold">Health Center</h1>
                    <h2 className="text-lg">Payment Records</h2>
                    <p>Date: {new Date().toLocaleDateString()}</p>
                  </header>
                  <table className="border w-full">
                    <thead>
                      <tr>
                        <th className="border">Patient Name</th>
                        <th className="border">Amount Due</th>
                        <th className="border">Amount Paid</th>
                        <th className="border">Account Number</th>
                        <th className="border">Payment Status</th>
                        <th className="border">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentRecords.map((record) => (
                        <tr key={record._id}>
                          <td className="border">{record.patientName}</td>
                          <td className="border">{record.amountDue}</td>
                          <td className="border">{record.amountPaid}</td>
                          <td className="border">{record.accountNumber}</td>
                          <td className="border">{record.paymentStatus}</td>
                          <td className="border">{record.paymentDate}</td>
                          <td className="border">
                            <button
                              onClick={() => handleUpdate(record)}
                              className="bg-yellow-500 text-white rounded px-2 py-1 hover:bg-yellow-600 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(record._id)}
                              className="bg-red-500 text-white rounded px-2 py-1 hover:bg-red-600 transition"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <footer className="mt-4 text-center">
                    <QRCodeCanvas value={`Patient: ${selectedPatient}, Account: ${accountNumber}`} size={128} />
                    <p>Thank you for choosing our health center!</p>
                  </footer>
                </div>
              </div>
            ) : (
              <p className="text-gray-700">No payment records available.</p>
            )}
          </div>
        </>
      ) : (
        <p className="text-gray-700">No patient data available.</p>
      )}
    </div>

    </div>
    <Footer/>
    </>
  );
};

export default Accounts;
