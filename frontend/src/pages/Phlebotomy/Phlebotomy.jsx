import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { usePatient } from '../../context/patientContext';
import 'react-toastify/dist/ReactToastify.css';
import img from '../../assets/logo1-removebg-preview.png';

const LabNumber = () => {
  const { patientData } = usePatient();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState(patientData?.patients || []);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [labNumber, setLabNumber] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredPatients(
      patientData.patients.filter((patient) =>
        patient.name.toLowerCase().includes(query)
      )
    );
  };

  const generateLabNumber = () => {
    if (!selectedPatient) {
      toast.warning('Please select a patient first.');
      return;
    }
    const uniqueNumber = `LAB-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    setLabNumber(uniqueNumber);
    setSubmissionStatus('');
  };

  const submitLabNumber = async () => {
    if (!labNumber || !selectedPatient) {
      toast.error('Please generate a lab number and select a patient first.');
      return;
    }
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSearchQuery('');
    setFilteredPatients(patientData?.patients || []);
    setSelectedPatient('');
    setLabNumber('');
    setSubmissionStatus('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(labNumber);
    toast.info('Lab number copied to clipboard.');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-300 p-6">
      {patientData && patientData.patients && patientData.patients.length > 0 ? (
        <>
          {/* Header Section */}
          <div className="flex flex-col items-center mb-12">
            <img src={img} alt="Logo" className="w-32 mb-6" />
            <h1 className="text-5xl font-bold text-teal-400 drop-shadow-md">
              Phlebotomy
            </h1>
            <p className="text-gray-400 mt-4 text-lg">
              Quickly generate and manage lab numbers for your patients.
            </p>
          </div>

          {/* Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-5xl">
            {/* Left Column */}
            <div>
              {/* Search Bar */}
              <div className="mb-8">
                <input
                  type="text"
                  placeholder="Search patients by name..."
                  className="w-full px-4 py-3 border-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 bg-gray-800 text-gray-300 placeholder-gray-500"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>

              {/* Patient Dropdown */}
              <div className="mb-8">
                <label className="block text-gray-500 font-semibold mb-2" htmlFor="patientSelect">
                  Select Patient
                </label>
                <select
                  id="patientSelect"
                  className="w-full px-4 py-3 border-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 bg-gray-800 text-gray-300"
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                >
                  <option value="" disabled>
                    Select Patient
                  </option>
                  {filteredPatients.map((patient) => (
                    <option key={patient.id} value={patient.name}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Patient Details */}
              {selectedPatient && (
                <div className="p-5 bg-gray-800 rounded-lg shadow-lg border border-teal-600">
                  <h3 className="text-lg font-semibold text-teal-300">Patient Details</h3>
                  <p className="text-gray-400">Name: {selectedPatient}</p>
                  <p className="text-gray-400">
                    ID: {filteredPatients.find((p) => p.name === selectedPatient)?.id}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="flex flex-col items-center">
              {/* Generate Lab Number Button */}
              <button
                onClick={generateLabNumber}
                className="bg-gradient-to-r from-teal-600 to-teal-400 text-gray-900 font-bold px-6 py-3 rounded-lg shadow-lg hover:from-teal-500 hover:to-teal-300 transform hover:scale-105 transition duration-300 mb-6"
              >
                Generate Lab Number
              </button>

              {/* Generated Lab Number */}
              {labNumber && (
                <div className="p-6 bg-gray-900 rounded-lg shadow-lg border border-red-500 text-center">
                  <p className="text-2xl font-bold text-red-400 mb-2">Generated Lab Number:</p>
                  <p className="text-xl text-teal-300 font-mono">{labNumber}</p>
                  <button
                    onClick={copyToClipboard}
                    className="mt-4 bg-gray-700 text-gray-300 font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-gray-600 transition"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={submitLabNumber}
                className="mt-6 bg-gradient-to-r from-red-600 to-red-500 text-gray-900 font-bold px-5 py-3 rounded-lg shadow-lg hover:from-red-500 hover:to-red-400 transform hover:scale-105 transition duration-300"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit Lab Number'}
              </button>

              {/* Reset Button */}
              <button
                onClick={resetForm}
                className="mt-6 bg-gray-700 text-gray-300 font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-gray-600 transition"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Toast Notifications */}
          <ToastContainer />
        </>
      ) : (
        <h1 className="text-3xl font-bold text-red-500">No patients available.</h1>
      )}
    </div>
  );
};

export default LabNumber;
