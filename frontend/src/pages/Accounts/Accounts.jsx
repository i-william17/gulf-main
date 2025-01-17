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
  const [modeOfPayment, setModeOfPayment] = useState('');
  const [commission, setCommission] = useState('');
  const [xrayPayment, setXrayPayment] = useState('');
  const [selectedPatient, setSelectedPatient] = useState("Select Patient");
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
      setSelectedPatient(currentRecord.patientName || '');
      setModeOfPayment(currentRecord.modeOfPayment || '');
      setAccountNumber(currentRecord.accountNumber || '');
      setAmountPaid(currentRecord.amountPaid || '');
      setCommission(currentRecord.commission || '');
      setXrayPayment(currentRecord.xrayPayment || '');
      setAmountDue(currentRecord.amountDue || '');
    } else {
      resetForm();
    }
  }, [currentRecord]);

  const handlePaymentSubmit = async () => {
    if (!selectedPatient || !modeOfPayment || !accountNumber || !amountPaid || !commission || !xrayPayment || !amountDue) {
      toast.error('Please enter all required fields.');
      return;
    }

    const newPayment = {
      patientName: selectedPatient,
      modeOfPayment: modeOfPayment,
      accountNumber: accountNumber,
      amountPaid: parseFloat(amountPaid),
      commission: parseFloat(commission),
      xrayPayment: parseFloat(xrayPayment),
      amountDue: parseFloat(amountDue),
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
    setModeOfPayment(record.modeOfPayment || '');
    setCommission(record.commission || '');
    setXrayPayment(record.xrayPayment || '');
  };

  const handleUpdateSubmit = async () => {
    if (!selectedPatient || !modeOfPayment || !accountNumber || !amountPaid || !commission || !xrayPayment || !amountDue) {
      toast.error('Please enter all required fields.');
      return;
    }

    const updatedPayment = {
      ...currentRecord,
      patientName: selectedPatient,
      modeOfPayment: modeOfPayment,
      accountNumber: accountNumber,
      amountPaid: parseFloat(amountPaid),
      commission: parseFloat(commission),
      xrayPayment: parseFloat(xrayPayment),
      amountDue: parseFloat(amountDue),
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
    setSelectedPatient('');
    setModeOfPayment('');
    setAccountNumber('');
    setAmountPaid('');
    setCommission('');
    setXrayPayment('');
    setAmountDue('');
    setCurrentRecord(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <div className="flex">
        <LeftBar />

        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-2xl p-8 space-y-8">
            <ToastContainer />

            <div className="border-b border-gray-200 pb-6">
              <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Accounts Office</h1>
              <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
            </div>

            {patientData ? (
              <div className="space-y-8">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-lg text-gray-700">
                    Patient Name: <span className="font-semibold text-blue-800">{selectedPatient || 'No data'}</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2" htmlFor="patientSelect">
                        Select Patient
                      </label>
                      <select
                        id="patientSelect"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out bg-white"
                        value={selectedPatient}
                        onChange={(e) => setSelectedPatient(e.target.value)}
                        disabled={!patientData.patients || patientData.patients.length === 0}
                      >
                        {/* Default "Select Patient" option */}
                        <option value="" disabled>Select Patient</option>
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


                    <div>
                      <label className="block text-gray-700 font-semibold mb-2" htmlFor="modeOfPayment">
                        Mode of Payment
                      </label>
                      <select
                        id="modeOfPayment"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out bg-white"
                        value={modeOfPayment}
                        onChange={(e) => setModeOfPayment(e.target.value)}
                      >
                        <option value="cash">Cash</option>
                        <option value="paybill">Paybill</option>
                        <option value="invoice">Invoice</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2" htmlFor="accountNumber">
                        REF NO.
                      </label>
                      <input
                        type="text"
                        id="accountNumber"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="Enter REF NO."
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2" htmlFor="amountPaid">
                        Amount Paid
                      </label>
                      <input
                        type="number"
                        id="amountPaid"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(e.target.value)}
                        placeholder="Enter amount paid"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2" htmlFor="commission">
                        Commission
                      </label>
                      <input
                        type="number"
                        id="commission"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                        value={commission}
                        onChange={(e) => setCommission(e.target.value)}
                        placeholder="Enter commission"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2" htmlFor="xrayPayment">
                        Xray Payment
                      </label>
                      <input
                        type="number"
                        id="xrayPayment"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                        value={xrayPayment}
                        onChange={(e) => setXrayPayment(e.target.value)}
                        placeholder="Enter xray payment"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="amountDue">
                      Amount Due
                    </label>
                    <input
                      type="number"
                      id="amountDue"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                      value={amountDue}
                      onChange={(e) => setAmountDue(e.target.value)}
                      placeholder="Enter amount due"
                    />
                  </div>

                  <button
                    onClick={currentRecord ? handleUpdateSubmit : handlePaymentSubmit}
                    className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {currentRecord ? 'Update Payment' : 'Record Payment'}
                  </button>
                </div>

                <div className="mt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Payment Records</h2>
                    {paymentRecords.length > 0 && (
                      <ReactToPrint
                        trigger={() => (
                          <button className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                            Print Records
                          </button>
                        )}
                        content={() => componentRef.current}
                      />
                    )}
                  </div>

                  {paymentRecords.length > 0 ? (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <div ref={componentRef} className="printable">
                        <style>
                          {`
                            @media print {
                              .printable {
                                margin: 0;
                                padding: 20px;
                                background: white;
                                color: black;
                              }
                              .printable h1, .printable h2 {
                                text-align: center;
                                margin-bottom: 20px;
                              }
                              .printable table {
                                width: 100%;
                                border-collapse: collapse;
                                margin-bottom: 20px;
                              }
                              .printable th, .printable td {
                                border: 1px solid #ddd;
                                padding: 12px;
                                text-align: left;
                              }
                              .printable th {
                                background-color: #f8f9fa;
                              }
                              .printable tr:nth-child(even) {
                                background-color: #f8f9fa;
                              }
                            }
                          `}
                        </style>

                        <header className="text-center p-6 border-b border-gray-200">
                          <img src={logo} alt="Logo" className="w-64 mx-auto mb-4" />
                          <h1 className="text-2xl font-bold text-gray-800">Health Center</h1>
                          <h2 className="text-xl text-gray-600">Payment Records</h2>
                          <p className="text-gray-500">Date: {new Date().toLocaleDateString()}</p>
                        </header>

                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode of Payment</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">REF NO.</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Xray Payment</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Due</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {paymentRecords.map((record) => (
                                <tr key={record._id} className="hover:bg-gray-50 transition-colors duration-150">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.patientName}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.modeOfPayment}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.accountNumber}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.amountPaid}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.commission}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.xrayPayment}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.amountDue}</td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.paymentStatus === 'Paid'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                      }`}>
                                      {record.paymentStatus}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.paymentDate}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button
                                      onClick={() => handleUpdate(record)}
                                      className="bg-yellow-500 text-white rounded-lg px-3 py-1.5 hover:bg-yellow-600 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDelete(record._id)}
                                      className="bg-red-500 text-white rounded-lg px-3 py-1.5 hover:bg-red-600 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <footer className="mt-8 text-center p-6 border-t border-gray-200">
                          <div className="flex flex-col items-center justify-center space-y-4">
                            <QRCodeCanvas
                              value={`Patient: ${selectedPatient}, Account: ${accountNumber}`}
                              size={128}
                              className="mb-4"
                            />
                            <p className="text-gray-600 font-medium">Thank you for choosing our health center!</p>
                            <p className="text-sm text-gray-500">For any inquiries, please contact our support team</p>
                          </div>
                        </footer>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                      <p className="text-gray-700 text-lg">No payment records available.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-700 text-lg">No patient data available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Accounts;