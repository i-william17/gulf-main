import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { usePatient } from '../../context/patientContext';
import 'react-toastify/dist/ReactToastify.css';
import img from '../../assets/logo1-removebg-preview.png';
import TopBar from '../../components/TopBar';

const Phlebotomy = () => {
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
    toast.success('Lab number generated successfully.');
  };

  const submitLabNumber = async () => {
    if (!labNumber || !selectedPatient) {
      toast.error('Please generate a lab number and select a patient first.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/number', {
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

  const selectedPatientData = selectedPatient
    ? patientData.patients.find((p) => p.name === selectedPatient)
    : null;
    const BarcodeComponent = ({ value }) => {
      return (
        <svg className="w-64 h-24 mt-2">
          {value.split('').map((char, index) => (
            <rect
              key={index}
              x={index * 2}
              y={0}
              width={1}
              height={40}
              fill={char.charCodeAt(0) % 2 === 0 ? 'black' : 'white'}
            />
          ))}
          <text x="0" y="60" className="text-xs font-mono">{value}</text>
        </svg>
      );
    };
  
    const PatientDetailsCard = ({ patient, labNumber }) => {
      return (
        <div className="print-section p-8 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl shadow-2xl border-2 border-teal-500/30 backdrop-blur-lg transition-all duration-300 hover:border-teal-400/50">
          <div className="non-printable-section print:hidden">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-teal-500 mb-6">
              Patient Details
            </h3>
            {selectedPatientData ? (
              <div className="flex items-start space-x-6">
                {selectedPatientData.photo && (
                  <div className="relative">
                    <img
                      src={`data:image/jpeg;base64,${selectedPatientData.photo}`}
                      alt="Patient"
                      className="w-32 h-32 rounded-lg shadow-xl object-cover border-2 border-teal-500/30 transform transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
  
                <div className="space-y-4 flex-1">
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 shadow-inner">
                    <p className="text-gray-300 mb-2">
                      <span className="font-semibold text-teal-400">Name:</span> 
                      <span className="ml-2 font-medium">{selectedPatientData.name}</span>
                    </p>
                    <p className="text-gray-300">
                      <span className="font-semibold text-teal-400">ID:</span>
                      <span className="ml-2 font-mono">{selectedPatientData._id}</span>
                    </p>
                  </div>
  
                  {labNumber && (
                    <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700 shadow-inner">
                      <p className="text-gray-300 mb-4">
                        <span className="font-semibold text-teal-400">Lab Number:</span>
                        <span className="ml-2 font-mono">{labNumber}</span>
                      </p>
                      <div className="bg-white p-4 rounded-lg">
                        <BarcodeComponent value={`${labNumber}`} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-red-400 font-medium italic">No patient selected.</p>
            )}
          </div>
  
          <div className="hidden print:block print:bg-white print:text-black">
            <div className="text-center mb-6 space-y-4">
              <h2 className="text-2xl font-bold">Patient Details</h2>
              {selectedPatientData.photo && (
                <img
                  src={`data:image/jpeg;base64,${selectedPatientData.photo}`}
                  alt="Patient"
                  className="w-24 h-24 mx-auto rounded-lg shadow-lg object-cover"
                />
              )}
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-semibold">Patient Name:</span> {selectedPatientData.name}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Patient ID:</span> {selectedPatientData._id}
                </p>
                {labNumber && (
                  <p className="text-sm">
                    <span className="font-semibold">Lab Number:</span> {labNumber}
                  </p>
                )}
              </div>
            </div>
            {labNumber && <BarcodeComponent value={`${labNumber}`} />}
          </div>
        </div>
      );
    };
  
    return (
      <>
        <TopBar />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-300 p-8 print:bg-white print:text-black">
          <div className="max-w-7xl mx-auto">
            {patientData && patientData.patients && patientData.patients.length > 0 ? (
              <>
                <div className="flex flex-col items-center mb-16 print:hidden">
                  <div className="relative">
                    <img src={img} alt="Logo" className="w-40 mb-8 drop-shadow-2xl transform hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent rounded-full blur-xl -z-10" />
                  </div>
                  <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-400 to-teal-500 mb-4">
                    Phlebotomy
                  </h1>
                  <p className="text-gray-400 text-xl font-light tracking-wide">
                    Quickly generate and manage lab numbers for your patients
                  </p>
                </div>
  
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
                  <div className="print:hidden space-y-8">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search patients by name..."
                        className="w-full px-6 py-4 bg-gray-800/50 border-2 border-gray-700 rounded-xl shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-gray-300 placeholder-gray-500 transition-all duration-300"
                        value={searchQuery}
                        onChange={handleSearch}
                      />
                      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-teal-500/10 to-transparent blur-xl" />
                    </div>
  
                    <div>
                      <label className="block text-lg font-medium text-gray-400 mb-3" htmlFor="patientSelect">
                        Select Patient
                      </label>
                      <select
                        id="patientSelect"
                        className="w-full px-6 py-4 bg-gray-800/50 border-2 border-gray-700 rounded-xl shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-gray-300 transition-all duration-300"
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
  
                    {selectedPatientData && (
                      <PatientDetailsCard
                        patient={selectedPatientData}
                        labNumber={labNumber}
                      />
                    )}
                  </div>
  
                  <div className="flex flex-col items-center space-y-8 print:hidden">
                    <button
                      onClick={generateLabNumber}
                      className="w-full max-w-md bg-gradient-to-r from-teal-600 to-teal-400 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:from-teal-500 hover:to-teal-300 transform hover:scale-105 transition duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                      Generate Lab Number
                    </button>
  
                    {labNumber && (
                      <div className="w-full max-w-md p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border-2 border-red-500/30 text-center space-y-6">
                        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-500">
                          Generated Lab Number:
                        </p>
                        <p className="text-2xl text-teal-300 font-mono bg-gray-900/50 py-3 px-4 rounded-lg">
                          {labNumber}
                        </p>
                        <div className="flex gap-4">
                          <button
                            onClick={copyToClipboard}
                            className="flex-1 bg-gray-700 text-gray-300 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                          >
                            Copy to Clipboard
                          </button>
                          <button
                            onClick={() => window.print()}
                            className="flex-1 bg-gray-700 text-gray-300 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                          >
                            Print Details
                          </button>
                        </div>
                      </div>
                    )}
  
                    <button
                      onClick={submitLabNumber}
                      className="w-full max-w-md bg-gradient-to-r from-red-600 to-red-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:from-red-500 hover:to-red-400 transform hover:scale-105 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Submitting...' : 'Submit Lab Number'}
                    </button>
  
                    <button
                      onClick={resetForm}
                      className="w-full max-w-md bg-gray-700 text-gray-300 font-semibold px-6 py-4 rounded-xl shadow-lg hover:bg-gray-600 transition-all duration-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Reset
                    </button>
                  </div>
                </div>
  
                {selectedPatientData && labNumber && (
                  <div className="hidden print:block w-full">
                    <PatientDetailsCard
                      patient={selectedPatientData}
                      labNumber={labNumber}
                    />
                  </div>
                )}
  
                <ToastContainer />
              </>
            ) : (
              <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-4xl font-bold text-red-500 bg-gray-900/50 px-8 py-4 rounded-xl border border-red-500/30">
                  No patients available.
                </h1>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };
  
  export default Phlebotomy;
  