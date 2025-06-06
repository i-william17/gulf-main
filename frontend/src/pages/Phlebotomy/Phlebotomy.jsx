import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
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
  const [labCounter, setLabCounter] = useState(1);
  const [submittedLabNumbers, setSubmittedLabNumbers] = useState([]);

  useEffect(() => {
    fetchLabNumbers();
  }, []);

  const fetchLabNumbers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/number');
      console.log('Fetched lab numbers:', res.data.labNumbers);
      toast.success('Lab numbers fetched successfully');
      setSubmittedLabNumbers(res.data.labNumbers);
      setLabCounter(res.data.labNumbers.length + 1);
    } catch (error) {
      console.error('Error fetching lab numbers:', error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredPatients(
      patientData.patients.filter((patient) =>
        patient.name.toLowerCase().includes(query)
      )
    );
  };

  const selectedPatientData = selectedPatient
    ? patientData.patients.find((p) => p.name === selectedPatient)
    : null;

  const generateLabNumber = () => {
    if (!selectedPatientData) {
      toast.warning('Please select a patient first.');
      return;
    }
    const formattedCounter = String(labCounter).padStart(3, '0');
    const uniqueNumber = `LAB-${selectedPatientData.passportNumber}-${formattedCounter}`;
    setLabNumber(uniqueNumber);
    setSubmissionStatus('');
    toast.success('Lab number generated successfully.');
  };

  const submitLabNumber = async () => {
    if (!labNumber || !selectedPatientData) {
      toast.error('Please generate a lab number and select a patient first.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/number', {
        number: labNumber,
        patient: selectedPatientData.name,
      });

      setSubmissionStatus(`Lab number submitted successfully: ${response.data.labNumber}`);
      toast.success(`Lab number submitted successfully`);
      setLabCounter((prev) => prev + 1); // Increment counter after successful submission
      setLabNumber('');
      fetchLabNumbers(); // Refresh list
    } catch (error) {
      toast.error('Failed to submit lab number. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLabNumber = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/number/${id}`);
      toast.success('Lab number deleted successfully');
      fetchLabNumbers(); // refresh
    } catch (err) {
      toast.error('Failed to delete lab number');
      console.error(err);
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
    if (labNumber) {
      navigator.clipboard.writeText(labNumber);
      toast.info('Lab number copied to clipboard.');
    }
  };

  const BarcodeComponent = ({ value }) => (
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

  const PatientDetailsCard = ({ patient, labNumber }) => (
    <div className="p-8 bg-gray-900 rounded-xl shadow-2xl border-2 border-teal-500/30">
      <h3 className="text-2xl font-bold text-teal-400 mb-6">Patient Details</h3>
      <div className="flex items-start space-x-6">
        {patient.photo && (
          <img
            src={`data:image/jpeg;base64,${patient.photo}`}
            alt="Patient"
            className="w-32 h-32 rounded-lg border-2 border-teal-500/30 object-cover"
          />
        )}
        <div className="flex-1">
          <p className="text-gray-300 mb-2">
            <strong className="text-teal-400">Name:</strong> {patient.name}
          </p>
          <p className="text-gray-300 mb-2">
            <strong className="text-teal-400">ID:</strong> {patient.passportNumber}
          </p>
          {labNumber && (
            <>
              <p className="text-teal-300 mt-4 font-mono">Lab Number: {labNumber}</p>
              <BarcodeComponent value={labNumber} />
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <TopBar />
      <div className="min-h-screen bg-black text-gray-200 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <img src={img} alt="Logo" className="w-24 mx-auto mb-4" />
            <h1 className="text-5xl font-bold text-teal-400">Phlebotomy</h1>
            <p className="text-gray-400">Generate and manage lab numbers</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-4 py-3 mb-4 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none"
              />
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="w-full px-4 py-3 mb-6 rounded-lg bg-gray-800 border border-gray-700"
              >
                <option value="">Select Patient</option>
                {filteredPatients.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>

              {selectedPatientData && (
                <PatientDetailsCard
                  patient={selectedPatientData}
                  labNumber={labNumber}
                />
              )}
            </div>

            <div className="space-y-6">
              <button
                onClick={generateLabNumber}
                className="w-full bg-teal-600 hover:bg-teal-500 text-white py-3 rounded-lg font-semibold"
              >
                Generate Lab Number
              </button>

              {labNumber && (
                <div className="p-4 bg-gray-800 rounded-lg text-center space-y-4">
                  <p className="text-xl font-bold text-teal-300">Lab Number:</p>
                  <p className="text-lg font-mono">{labNumber}</p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={copyToClipboard}
                      className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Print
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={submitLabNumber}
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {isLoading ? 'Submitting...' : 'Submit Lab Number'}
              </button>

              <button
                onClick={resetForm}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg"
              >
                Reset
              </button>
            </div>
          </div>

          {submittedLabNumbers.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-teal-300 mb-4">Submitted Lab Numbers</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border border-gray-700">
                  <thead>
                    <tr className="bg-gray-800 text-left text-teal-400">
                      <th className="px-4 py-2 border-b border-gray-600">#</th>
                      <th className="px-4 py-2 border-b border-gray-600">Patient</th>
                      <th className="px-4 py-2 border-b border-gray-600">Lab Number</th>
                      <th className="px-4 py-2 border-b border-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submittedLabNumbers.map((entry, index) => (
                      <tr key={entry._id || index} className="hover:bg-gray-800/50">
                        <td className="px-4 py-2 border-b border-gray-700">{index + 1}</td>
                        <td className="px-4 py-2 border-b border-gray-700">{entry.patient}</td>
                        <td className="px-4 py-2 border-b border-gray-700 font-mono">{entry.number}</td>
                        <td className="px-4 py-2 border-b border-gray-700">
                          <button
                            onClick={() => deleteLabNumber(entry._id)}
                            className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Phlebotomy;
