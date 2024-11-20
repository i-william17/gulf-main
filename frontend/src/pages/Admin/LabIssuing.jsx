import React, { useState } from 'react';
import axios from 'axios';
import {toast, ToastContainer} from 'react-toastify';
import { usePatient } from '../../context/patientContext';

const LabNumber = () => {
  const { patientData } = usePatient();
  const [selectedPatient, setSelectedPatient] = useState('Select Patient');
  const [labNumber, setLabNumber] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState('');

  const generateLabNumber = () => {
    const uniqueNumber = `LAB-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    setLabNumber(uniqueNumber);
    setSubmissionStatus(''); // Reset submission status when a new number is generated
  };

  const submitLabNumber = async () => {
    if (!labNumber) {
      setSubmissionStatus('Generate a lab number first.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/lab/generate', {
        number: labNumber,
        patient: selectedPatient,
      });
      setSubmissionStatus(`Lab number submitted successfully: ${response.data.labNumber}`);
      toast.success(`Lab number submitted successfully: ${response.data.labNumber}`);
    } catch (error) {
      setSubmissionStatus('Failed to submit lab number. Please try again.');
      toast.error('Failed to submit lab number. Please try again.');
      console.error('Error submitting lab number:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      {patientData && patientData.patients && patientData.patients.length > 0 ? (
        <>
          <div className="mb-6 text-center">
            <h1 className="text-4xl font-extrabold text-blue-700 mb-2">Lab Number Generator</h1>
            <p className="text-lg text-gray-700">
              Patient Name: <span className="font-semibold">{selectedPatient !== 'Select Patient' ? selectedPatient : 'No patient selected'}</span>
            </p>
          </div>

          <div className="mb-6 w-full max-w-md">
            <label className="block text-gray-600 font-semibold mb-2" htmlFor="patientSelect">
              Select Patient
            </label>
            <select
              id="patientSelect"
              className="w-full px-4 py-3 border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 transition duration-150 ease-in-out"
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
            >
              <option disabled>Select Patient</option>
              {patientData.patients.map((patient) => (
                <option key={patient.id} value={patient.name}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={generateLabNumber}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition duration-300 mb-4"
          >
            Generate Lab Number
          </button>

          {labNumber && (
            <div className="mt-4 p-6 bg-white rounded-xl shadow-lg border border-gray-200 text-center">
              <p className="text-2xl font-bold text-blue-700 mb-2">Generated Lab Number:</p>
              <p className="text-xl text-blue-600 font-mono">{labNumber}</p>
              <button
                onClick={submitLabNumber}
                className="mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold px-5 py-3 rounded-lg shadow-lg hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition duration-300"
              >
                Submit Lab Number
              </button>
            </div>
          )}

          {submissionStatus && (
            <p
              className={`mt-4 text-lg font-semibold ${
                submissionStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {submissionStatus}
            </p>
          )}
          <ToastContainer />
        </>
      ) : (
        <h1 className="text-3xl font-bold text-red-600">No patients available.</h1>
      )}
    </div>
  );
};

export default LabNumber;
