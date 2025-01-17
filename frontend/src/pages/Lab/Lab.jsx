import React, { useState, useEffect } from 'react';
import { usePatient } from '../../context/patientContext';
import { Formik, Form, Field } from 'formik';
import TableRow from '../../components/TableRow';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import TopBar from '../../components/TopBar';
import { TESTS_BY_UNIT, initialValues } from './LabFunctions';
import LeftBar from '../../components/LeftBar';
import { FaSave } from 'react-icons/fa';
import Footer from '../../components/Footer';

const Lab = () => {
  const { patientData, updatePateintData } = usePatient();
  const [selectedPatient, setSelectedPatient] = useState('Select Patient')
  const [bloodGroups, setBloodGroups] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState({});
  const [selectedTests, setSelectedTests] = useState({});
  const [selectAll, setSelectAll] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [overallStatus, setOverallStatus] = useState('');
  const [otherAspectsFit, setOtherAspectsFit] = useState('');
  const [labSuperintendent, setLabSuperintendent] = useState('');
  const [selectedLabNumber, setSelectedLabNumber] = useState('');
  const [labNumbers, setLabNumbers] = useState([]);
  const [labNumberSearchTerm, setLabNumberSearchTerm] = useState('');
  const [isLoadingLabNumbers, setIsLoadingLabNumbers] = useState(true);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');


  useEffect(() => {
    const fetchLabNumbers = async () => {
      setIsLoadingLabNumbers(true);
      axios.get('http://localhost:5000/api/number')
        .then((response) => {
          setLabNumbers(response.data.labNumbers);  // Assuming response contains labNumbers
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to fetch lab numbers');
          setLoading(false);
        });
    };

    fetchLabNumbers();

    // Initialize blood groups immediately
    setBloodGroups(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']);

    console.log('Patient data:', patientData);
  }, [patientData]); // Removed `numbers` from dependencies

  const filteredLabNumbers = labNumbers.filter((lab) =>
    lab.number.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSelectChange = (event) => {
    setSelectedLabNumber(event.target.value);
  };


  const handleUnitSelect = (unit) => {
    setSelectedUnits((prev) => ({
      ...prev,
      [unit]: !prev[unit],
    }));
    if (selectedUnits[unit]) {
      setSelectAll((prev) => ({ ...prev, [unit]: false }));
      setSelectedTests((prev) => ({ ...prev, [unit]: {} }));
    }
  };

  const handleTestSelect = (unit, test) => {
    setSelectedTests((prev) => ({
      ...prev,
      [unit]: {
        ...prev[unit],
        [test]: !prev[unit]?.[test],
      },
    }));
  };

  const handleSelectAllTests = (unit) => {
    const allTestsSelected = !selectAll[unit];
    setSelectAll((prev) => ({ ...prev, [unit]: allTestsSelected }));

    setSelectedTests((prev) => ({
      ...prev,
      [unit]: allTestsSelected
        ? TESTS_BY_UNIT[unit].reduce((acc, test) => ({ ...acc, [test]: true }), {})
        : {},
    }));
  };

  const handleSelectAllTestsInUnit = (unit) => {
    setSelectedUnits((prev) => ({
      ...prev,
      [unit]: !prev[unit],
    }));
  };

  const labRemarks = {
    fitnessEvaluation: {
      otherAspectsFit: otherAspectsFit,
      overallStatus: overallStatus
    },
    labSuperintendent: {
      name: labSuperintendent
    }
  };

  const selectedPatientData = patientData?.patients.find(
    (patient) => patient.name === selectedPatient
  );
  const patientImage = selectedPatientData?.image;

  const handleSubmit = async (values, { resetForm }) => {
    try {
      console.log("Form values:", values);
      console.log("Patient data:", patientData);
      // Check if patient data and selected patient are valid
      if (!patientData || !Array.isArray(patientData.patients)) {
        console.error("Patient data is not correctly loaded or structured.");
        toast.error("Patient data is not available. Please reload the page.");
        return;
      }
      if (!selectedPatient) {
        console.error("No patient selected.");
        toast.error("Please select a patient before submitting.");
        return;
      }
      // Find the patientId based on the selected patient
      const patient = patientData.patients.find((patient) => patient.name === selectedPatient);
      if (!patient) {
        console.error("No matching patient found for the selected name:", selectedPatient);
        toast.error("Please select a valid patient.");
        return;
      }
      // Use the patient's photo URL directly (no conversion to Base64)
      const patientImage = patient.photo;
      // Construct the payload
      const payload = {
        patientId: patient.id,
        patientName: selectedPatient,
        labNumber: selectedLabNumber,
        labData: values,
        patientImage: patientImage, // Use the image URL directly
        labRemarks: labRemarks,
        selectedTests: selectedTests,
        timeStamp: Date.now(),
      };
      console.log("Payload:", payload);
      // Send the payload to the server
      const response = await axios.post("http://localhost:5000/api/lab", payload);
      const data = response.data;
      console.log("Response data:", data);
      if (data.success) {
        toast.success("Lab report submitted successfully");
        //reload page
        window.location.reload();
        resetForm();
        // Reset relevant states
        setSelectedUnits({});
        setSelectedTests({});
        setSelectAll({});
        setOverallStatus("");
        setOtherAspectsFit("");
        setLabSuperintendent("");
      } else {
        console.error("Lab report submission failed:", data.error);
        toast.error(data.error || "Lab report submission failed");
      }
    } catch (error) {
      console.error("Error submitting lab report:", error.response?.data || error.message);
      toast.error("Error submitting lab report");
    }
  };



  // Filter patients based on the search term
  const filteredPatients = patientData.patients.filter((patient) =>
    patient.name && patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <>
      <TopBar />

      <div className='flex'>
        <LeftBar />

        {patientData ? (

          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {() => (
              <Form className='max-w-11/12 mx-auto p-6 bg-white shadow-lg rounded-lg'>

                <h1 className="text-2xl font-extrabold text-center mb-8 text-blue-700 transition duration-300 hover:text-blue-900 shadow-md p-4 rounded-md bg-gradient-to-r from-blue-50 to-blue-200 hover:from-blue-100 hover:to-blue-300">
                  COMPREHENSIVE LABORATORY EXAMINATION REPORT
                </h1>

                <ToastContainer />

                <p className="text-lg text-gray-700 mb-4">
                  Patient Name: <span className="font-semibold">{selectedPatient || 'No data'}</span>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-lg shadow-lg">
                  {/* Patient Image Display */}
                  <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                    {selectedPatient ? (
                      patientData.patients
                        .filter((patient) => patient.name === selectedPatient)
                        .map((patient) => (
                          <div key={patient.labNumber} className="flex flex-col items-center space-y-4">
                            {/* Patient Image */}
                            {patient.photo ? (
                              <img
                                src={`data:image/jpeg;base64,${patient.photo}`}
                                alt={`${patient.name}`}
                                className="w-40 h-40 rounded-full shadow-lg object-cover border-4 border-blue-500 transition-transform transform hover:scale-105"
                              />
                            ) : (
                              <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold shadow-lg">
                                No Image
                              </div>
                            )}

                            {/* Patient Details */}
                            <h2 className="text-lg font-bold text-gray-800">{patient.name}</h2>
                            <p className="text-gray-500 text-sm italic">
                              Lab Number: <span className="font-semibold">{selectedLabNumber}</span>
                            </p>
                          </div>
                        ))
                    ) : (
                      <div className="text-gray-500 italic">No patient selected.</div>
                    )}
                  </div>

                  {/* Search and Dropdown */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    {/* Search Input */}
                    <div className="mb-6">
                      <label
                        className="block text-gray-600 font-semibold mb-2"
                        htmlFor="patientSearch"
                      >
                        <i className="fas fa-search mr-2 text-blue-500"></i>Search Patient
                      </label>
                      <input
                        type="text"
                        id="patientSearch"
                        placeholder="Search by name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    {/* Dropdown for Selecting Patient */}
                    <div>
                      <label
                        className="block text-gray-600 font-semibold mb-2"
                        htmlFor="patientSelect"
                      >
                        <i className="fas fa-user mr-2 text-blue-500"></i>Select Patient
                      </label>
                      <select
                        id="patientSelect"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-700 bg-white"
                        value={selectedPatient}
                        onChange={(e) => setSelectedPatient(e.target.value)}
                        disabled={!patientData.patients || patientData.patients.length === 0}
                      >
                        {/* Default option */}
                        <option value="Select Patient">Select Patient</option>
                        {filteredPatients.length > 0 ? (
                          filteredPatients.map((patient) => (
                            <option key={patient.labNumber} value={patient.name}>
                              {patient.name}
                            </option>
                          ))
                        ) : (
                          <option>No patients found</option>
                        )}
                      </select>

                      {/* New Lab Number Selection */}
                      <div className="max-w-4xl mx-auto">
                        <label className="block text-gray-600 font-semibold mt-5 mb-2">Lab Numbers</label>

                        {loading && <div className="text-center text-gray-500">Loading...</div>}
                        {error && <div className="text-center text-red-500">{error}</div>}

                        {!loading && !error && labNumbers.length > 0 ? (
                          <div>
                            <div className="mb-6">
                              <input
                                type="text"
                                placeholder="Search Lab Number"
                                value={search}
                                onChange={handleSearchChange}
                                className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
                              />
                            </div>

                            <div className="relative mb-6">
                              <select
                                value={selectedLabNumber}
                                onChange={handleSelectChange}
                                className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
                              >
                                <option value="">Select Lab Number</option>
                                {filteredLabNumbers.map((lab) => (
                                  <option key={lab._id} value={lab.number}>
                                    {lab.number}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {selectedLabNumber && (
                              <div className="mt-4 text-sm text-gray-700">
                                <p>Selected Lab Number: <span className="font-semibold">{selectedLabNumber}</span></p>
                              </div>
                            )}
                          </div>
                        ) : (
                          !loading && !error && (
                            <div className="text-center text-gray-500">No lab numbers available</div>
                          )
                        )}
                      </div>


                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Urine Test Section */}
                  <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                    <h3 className="flex items-center gap-4 text-xl font-semibold mb-4">
                      <label className="flex items-center gap-4 text-black">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300" checked={selectedUnits.urineTest || false} onChange={() => handleUnitSelect('urineTest')} /> <b>Urine Test</b></label>
                      {selectedUnits.urineTest && (
                        <label className="flex items-center gap-2 text-sm text-black"><input type="checkbox" className="w-4 h-4 rounded border-gray-300" checked={selectAll.urineTest || false} onChange={() => handleSelectAllTests('urineTest')} />Select All</label>)}
                    </h3>
                    {selectedUnits.urineTest && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                          <label className='flex items-center gap-2'><input type="checkbox" className="w-4 h-4 rounded border-gray-300" checked={selectedTests.urineTest?.albumin || false} onChange={() => handleTestSelect('urineTest', 'albumin')} /> Albumin:</label>
                          {selectedTests.urineTest?.albumin && (<Field name="urineTest.albumin" className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" type="text" />)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                          <label className='flex items-center gap-2'><input type="checkbox" className="w-4 h-4 rounded border-gray-300" checked={selectedTests.urineTest?.sugar || false} onChange={() => handleTestSelect('urineTest', 'sugar')} /> Sugar:</label>
                          {selectedTests.urineTest?.sugar && (<Field name="urineTest.sugar" className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" type="text" />)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                          <label className='flex items-center gap-2'><input type="checkbox" className="w-4 h-4 rounded border-gray-300" checked={selectedTests.urineTest?.microscopic || false} onChange={() => handleTestSelect('urineTest', 'microscopic')} /> Microscopic:</label>
                          {selectedTests.urineTest?.microscopic && (<Field className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" name="urineTest.microscopic" type="text" />)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                          <label className='flex items-center gap-2'><input type="checkbox" className="w-4 h-4 rounded border-gray-300" checked={selectedTests.urineTest?.reaction || false} onChange={() => handleTestSelect('urineTest', 'reaction')} /> Reaction:</label>
                          {selectedTests.urineTest?.reaction && (<Field className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" name="urineTest.reaction" type="text" />)}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Blood Test Section */}
                  <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                    <h3 className='flex items-center gap-4 text-xl font-semibold mb-4 text-black'>
                      <label className="flex items-center gap-2 text-black">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300" checked={selectedUnits.bloodTest || false} onChange={() => handleUnitSelect('bloodTest')} /><b>Blood Test</b></label>
                      {selectedUnits.bloodTest && (
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="w-4 h-4 rounded border-gray-300" checked={selectAll.bloodTest || false} onChange={() => handleSelectAllTests('bloodTest')} />Select All</label>)}
                    </h3>
                    {selectedUnits.bloodTest && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                          <label className="flex items-center gap-2 text-black"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-black" checked={selectedTests.bloodTest?.hivTest || false} onChange={() => handleTestSelect('bloodTest', 'hivTest')} /> HIV Test (I, II):</label>
                          {selectedTests.bloodTest?.hivTest && (<Field className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" name="bloodTest.hivTest" type="text" />)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                          <label className="flex items-center gap-2 text-black"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-black" checked={selectedTests.bloodTest?.hbsAg || false} onChange={() => handleTestSelect('bloodTest', 'hbsAg')} /> HbsAg:</label>
                          {selectedTests.bloodTest?.hbsAg && (<Field className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" name="bloodTest.hbsAg" type="text" />)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                          <label className="flex items-center gap-2 text-black"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-black" checked={selectedTests.bloodTest?.hcv || false} onChange={() => handleTestSelect('bloodTest', 'hcv')} /> HCV:</label>
                          {selectedTests.bloodTest?.hcv && (<Field className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" name="bloodTest.hcv" type="text" />)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                          <label className="flex items-center gap-2 text-black"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-black" checked={selectedTests.bloodTest?.esr || false} onChange={() => handleTestSelect('bloodTest', 'esr')} /> ESR(1stHR):</label>
                          {selectedTests.bloodTest?.esr && (<Field className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" name="bloodTest.esr" type="text" />)}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Laboratory Test Section */}
                <div className="grid grid-cols-4 gap-2 mb-8 p-6 bg-gray-50 rounded-lg">
                  <h3 className='flex items-center gap-4 text-xl font-semibold mb-4 text-black'>
                    <label className="flex items-center gap-2 text-black">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300" checked={selectedUnits.area1 || false} onChange={() => handleUnitSelect('area1')} /><b>Laboratory Tests</b></label>
                    {selectedUnits.area1 && (
                      <label> <input type="checkbox" className="w-4 h-4 rounded border-gray-300" checked={selectAll.area1 || false} onChange={() => handleSelectAllTests('area1')} />Select All</label>)}
                  </h3>
                  {selectedUnits.area1 && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <label><input type="checkbox" checked={selectedTests.area1?.stoolConsistency || false} onChange={() => handleTestSelect('area1', 'stoolConsistency')} /> stool Consistency:</label>
                        {selectedTests.area1?.stoolConsistency && (<Field name="area1.stoolConsistency" type="text" />)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <label><input type="checkbox" checked={selectedTests.area1?.stoolMicroscopy || false} onChange={() => handleTestSelect('area1', 'stoolMicroscopy')} /> stoolMicroscopy:</label>
                        {selectedTests.area1?.stoolMicroscopy && (<Field name="area1.stoolMicroscopy" type="text" />)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <label><input type="checkbox" checked={selectedTests.area1?.tpha || false} onChange={() => handleTestSelect('area1', 'tpha')} /> TPHA:</label>
                        {selectedTests.area1?.tpha && (<Field name="area1.tpha" type="text" />)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <label><input type="checkbox" checked={selectedTests.area1?.vdrlTest || false} onChange={() => handleTestSelect('area1', 'vdrlTest')} /> VDRL Test:</label>
                        {selectedTests.area1?.vdrlTest && (<Field name="area1.vdrlTest" type="text" />)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <label><input type="checkbox" checked={selectedTests.area1?.venerealDisease || false} onChange={() => handleTestSelect('area1', 'venerealDisease')} /> venereal Disease:</label>
                        {selectedTests.area1?.venerealDisease && (<Field name="area1.venerealDisease" type="text" />)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <label><input type="checkbox" checked={selectedTests.area1?.pregnancyTest || false} onChange={() => handleTestSelect('area1', 'pregnancyTest')} /> Pregnancy Test:</label>
                        {selectedTests.area1?.pregnancyTest && (<Field name="area1.pregnancyTest" type="text" />)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <label><input type="checkbox" checked={selectedTests.area1?.typhoid || false} onChange={() => handleTestSelect('area1', 'typhoid')} /> Typhoid:</label>
                        {selectedTests.area1?.typhoid && (<Field name="area1.typhoid" type="text" />)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <label><input type="checkbox" checked={selectedTests.area1?.hydrocele || false} onChange={() => handleTestSelect('area1', 'hydrocele')} /> Hydrocele:</label>
                        {selectedTests.area1?.hydrocele && (<Field name="area1.hydrocele" type="text" />)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <label><input type="checkbox" checked={selectedTests.area1?.otherDeformities || false} onChange={() => handleTestSelect('area1', 'otherDeformities')} /> Other Deformities:</label>
                        {selectedTests.area1?.otherDeformities && (<Field name="area1.otherDeformities" type="text" />)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <label><input type="checkbox" checked={selectedTests.area1?.earRight || false} onChange={() => handleTestSelect('area1', 'earRight')} /> Ear Right:</label>
                        {selectedTests.area1?.earRight && (<Field name="area1.earRight" type="text" />)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <label><input type="checkbox" checked={selectedTests.area1?.earLeft || false} onChange={() => handleTestSelect('area1', 'earLeft')} /> Ear Left:</label>
                        {selectedTests.area1?.earLeft && (<Field name="area1.earLeft" type="text" />)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <label><input type="checkbox" checked={selectedTests.area1?.lungs || false} onChange={() => handleTestSelect('area1', 'lungs')} /> Lungs:</label>
                        {selectedTests.area1?.lungs && (<Field name="area1.lungs" type="text" />)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <label><input type="checkbox" checked={selectedTests.area1?.liver || false} onChange={() => handleTestSelect('area1', 'liver')} /> Liver:</label>
                        {selectedTests.area1?.liver && (<Field name="area1.liver" type="text" />)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <label><input type="checkbox" checked={selectedTests.area1?.spleen || false} onChange={() => handleTestSelect('area1', 'spleen')} /> spleen:</label>
                        {selectedTests.area1?.spleen && (<Field name="area1.spleen" type="text" />)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <label><input type="checkbox" checked={selectedTests.area1?.bloodGroup || false} onChange={() => handleTestSelect('area1', 'bloodGroup')} /> Blood Group:</label>
                        {selectedTests.area1?.bloodGroup && (<Field name="area1.bloodGroup" type="text" />)}
                      </div>
                    </>
                  )}
                </div>

                {/* Renal Function Test Section */}
                <div className="overflow-x-auto">
                  <h3 className="flex items-center gap-4 text-xl font-semibold mb-4 text-black">
                    <label className="flex items-center gap-2 text-black">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300"
                        checked={selectedUnits.renalFunction || false}
                        onChange={() => handleSelectAllTestsInUnit('renalFunction')}
                      />{' '}
                      Renal Function Test
                    </label>
                  </h3>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Test
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Value
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Range
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {['urea', 'creatinine', 'fastingBloodSugar'].map((test) => (
                        <TableRow
                          key={test}
                          testName={test.replace(/([A-Z])/g, ' $1')}
                          namePrefix={`renalFunction.${test}`}
                          rangePlaceholder="Range"
                          disabled={!selectedUnits.renalFunction}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Full Haemogram Section */}
                <div className='grid grid-cols-2 gap-3 mt-10'>
                  <div className="overflow-x-auto">
                    <h3 className='flex items-center gap-4 text-xl font-semibold mb-4 text-black'>
                      <label className="flex items-center gap-2 text-black">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300" checked={selectedUnits.fullHaemogram || false} onChange={() => handleSelectAllTestsInUnit('fullHaemogram')} /> Full Haemogram Report</label>
                    </h3>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className='bg-gray-50'>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Range</th>
                        </tr>
                      </thead>
                      <tbody>
                        {['wbc', 'lym', 'mid', 'gran', 'rbc', 'mcv', 'hgb', 'hct', 'mch', 'mchc', 'rwd', 'plcr', 'plt', 'mpv', 'pct', 'pdw'].map((test) => (
                          <TableRow
                            key={test}
                            testName={test.toUpperCase()}
                            namePrefix={`fullHaemogram.${test}`}
                            unitsPlaceholder="Units"
                            rangePlaceholder="Range"
                            disabled={!selectedUnits.fullHaemogram}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Liver Function Test Section */}
                  <div className="overflow-x-auto">
                    <h3 className='flex items-center gap-4 text-xl font-semibold mb-4 text-black'>
                      <label className="flex items-center gap-2 text-black">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300" checked={selectedUnits.liverFunction || false} onChange={() => handleSelectAllTestsInUnit('liverFunction')} /> Liver Function Test</label>
                    </h3>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className='bg-gray-50'>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Range</th>
                        </tr>
                      </thead>
                      <tbody>
                        {['totalBilirubin', 'directBilirubin', 'indirectBilirubin', 'sgot', 'sgpt', 'gammaGt', 'alkalinePhosphate', 'totalProteins', 'albumin1'].map((test) => (
                          <TableRow
                            key={test}
                            testName={test.replace(/([A-Z])/g, ' $1')}
                            namePrefix={`liverFunction.${test}`}
                            rangePlaceholder="Range"
                            disabled={!selectedUnits.liverFunction}
                          />
                        ))}
                      </tbody>
                    </table>

                    {/* Lab Remarks */}
                    <div className="bg-gray-100 flex flex-col items-center justify-center p-6">
                      {/* Fitness Evaluation Section */}
                      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
                        <h3 className="text-2xl font-bold text-teal-600 mb-6 text-center">
                          Fitness Evaluation
                        </h3>

                        {/* First Dropdown for Other Aspects */}
                        <div className="mb-2">
                          <label className="block text-gray-700 font-medium mb-2">
                            Does applicant appear fit in all other respects?
                          </label>
                          <select className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                            value={otherAspectsFit}
                            onChange={(e) => setOtherAspectsFit(e.target.value)}
                          >
                            <option value="" disabled>Select</option>
                            <option value="YES">YES</option>
                            <option value="NO">NO</option>
                          </select>
                        </div>

                        {/* Second Dropdown for Overall Opinion */}
                        <div className="mb-2">
                          <label className="block text-gray-700 font-medium mb-2">
                            In my opinion, I find the applicant
                            <select className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                              value={overallStatus}
                              onChange={(e) => setOverallStatus(e.target.value)}
                            >
                              <option value="" disabled>Select</option>
                              <option value="FIT">FIT</option>
                              <option value="UNFIT">UNFIT</option>
                              <option value="NOT SURE">NOT SURE</option>
                            </select>
                            for employment.
                          </label>
                        </div>
                      </div>

                      {/* Lab Superintendent Section */}
                      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg mt-2">
                        <h3 className="text-2xl font-bold text-teal-600 mb-6 text-center">
                          Lab Superintendent
                        </h3>
                        <label className="block text-gray-700 font-medium mb-2">
                          Name:
                          <input
                            type="text"
                            placeholder="Enter Lab Superintendent Name"
                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                            value={labSuperintendent}
                            onChange={(e) => setLabSuperintendent(e.target.value)}
                          />
                        </label>
                      </div>
                    </div>

                  </div>

                </div>

                <button type="submit" class="mt-10 w-1/4 bg-blue-500 hover:bg-blue-600 text-white text-[16px] font-semibold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105"><FaSave className='inline mr-3' />SUBMIT LAB REPORT</button>

              </Form>

            )}
          </Formik>

        ) : (
          <div className="flex items-center justify-center h-screen">
            <div className="text-lg font-semibold text-gray-600">
              Please select a patient to view their lab reports.
            </div>
          </div>
        )};

      </div>
      <Footer />
    </>
  );
};

export default Lab;