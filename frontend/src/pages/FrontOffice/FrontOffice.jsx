import React, { useState, useEffect, useRef } from 'react';
import ReactToPrint from 'react-to-print'; // Import ReactToPrint
import {
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import Webcam from 'react-webcam';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import logo from '../../assets/GULF HEALTHCARE KENYA LTD.png'

const medicalTypes = ['MAURITIUS', 'SM-VDRL', 'MEDICAL', 'FM', 'NORMAL'];

const FrontOffice = () => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [showWebcam, setShowWebcam] = useState(false);
  const [formValues, setFormValues] = useState({
    _id: '',
    name: '',
    passportNumber: '',
    issuingCountry: '',
    occupation: '',
    sex: '',
    height: '',
    weight: '',
    age: '',
    photo: '',
    medicalType: '',
  });

  const webcamRef = useRef(null);
  const tableRef = useRef(null); // Reference to the table for printing
  const { patientId } = useParams();

  useEffect(() => {
    const fetchPatientData = async () => {
      if (patientId) {
        try {
          const response = await axios.get(`http://localhost:5000/api/patient/${patientId}`);
          setPatient(response.data);
          setFormValues(response.data);
        } catch (error) {
          console.error('Error fetching patient data:', error);
          toast.error('Failed to fetch patient data.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    const fetchAllPatients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/patient');
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast.error('Failed to fetch patients.');
      } finally {
        setLoadingPatients(false);
      }
    };

    fetchPatientData();
    fetchAllPatients();
  }, [patientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const captureImage = () => {
    return webcamRef.current.getScreenshot();
  };

  const renderPhotoInput = () => (
    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <label>Upload Photo: </label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFormValues({ ...formValues, photo: URL.createObjectURL(e.target.files[0]) })}
        style={{ marginBottom: '10px' }}
      />
      <Button variant="outlined" color="primary" onClick={() => setShowWebcam(!showWebcam)}>
        {showWebcam ? 'Hide Webcam' : 'Take Live Picture'}
      </Button>
      {showWebcam && (
        <div style={{ marginTop: '10px' }}>
          <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
          <Button variant="contained" color="primary" onClick={() => setFormValues({ ...formValues, photo: captureImage() })}>
            Capture
          </Button>
        </div>
      )}
      {formValues.photo && (
        <img src={formValues.photo} alt="Patient" style={{ width: '100px', height: 'auto', marginTop: '10px' }} />
      )}
    </div>
  );

  const renderFields = () => {
    const commonFields = (
      <>
        <TextField
          name="name"
          label="Name"
          value={formValues.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          name="age"
          label="Age"
          type="number"
          value={formValues.age}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          name="sex"
          label="Sex"
          value={formValues.sex}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          name="passportNumber"
          label="Passport Number"
          value={formValues.passportNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
      </>
    );

    switch (formValues.medicalType) {
      case 'MAURITIUS':
      case 'MEDICAL':
      case 'FM':
        return (
          <>
            {commonFields}
            <TextField
              name="issuingCountry"
              label="Issuing Country"
              value={formValues.issuingCountry}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="occupation"
              label="Occupation"
              value={formValues.occupation}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="height"
              label="Height (cm)"
              type="number"
              value={formValues.height}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="weight"
              label="Weight (kg)"
              type="number"
              value={formValues.weight}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            {renderPhotoInput()}
          </>
        );
      case 'SM-VDRL':
      case 'NORMAL':
        return (
          <>
            {commonFields}
            {renderPhotoInput()}
          </>
        );
      default:
        return null;
    }
  };

  const resetForm = () => {
    setFormValues({
      _id: '',
      name: '',
      passportNumber: '',
      issuingCountry: '',
      occupation: '',
      sex: '',
      height: '',
      weight: '',
      age: '',
      photo: '',
      medicalType: '',
    });
    setShowWebcam(false); // Reset webcam state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    const requiredFields = ['name', 'age', 'sex', 'passportNumber', 'medicalType'];
    for (const field of requiredFields) {
      if (!formValues[field]) {
        toast.error(`${field} is required.`);
        return; // Prevent form submission if a required field is missing
      }
    }

    // FormData for file uploads
    const formData = new FormData();
    for (const key in formValues) {
      formData.append(key, formValues[key]);
    }

    try {
      await axios.post('http://localhost:5000/api/patient', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Form submitted successfully');
      resetForm(); // Reset form after successful submission
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
      toast.error('Failed to submit the form: ' + (error.response?.data?.message || error.message));
    }
  };

  const handlePrint = useRef(null); // Create ref for ReactToPrint

  if (loading || loadingPatients) {
    return (
      <Container maxWidth="sm">
        <CircularProgress />
        <Typography variant="h6" align="center">Loading patient data...</Typography>
      </Container>
    );
  }

  // Prepare data for chart
  const medicalTypeCounts = medicalTypes.map(type => ({
    type,
    count: patients.filter(patient => patient.medicalType === type).length,
  }));

  return (
    <Container maxWidth="lg" sx={{ marginTop: 2, marginBottom: 4, padding: 2, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Patient Registration Form
      </Typography>
      <form onSubmit={handleSubmit}>
        {renderFields()}
        <TextField
          select
          name="medicalType"
          label="Medical Type"
          value={formValues.medicalType}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          {medicalTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="contained" color="primary" type="submit">Submit</Button>
      </form>

      <Typography variant="h5" align="center" gutterBottom style={{ marginTop: '20px' }}>
        Patients List
      </Typography>

      <ReactToPrint
        trigger={() => 
          <button className="bg-green-500 text-white font-semibold mb-4 py-1 px-2 rounded hover:bg-green-600 transition">
          Print Records
        </button>
      }
        content={() => tableRef.current} // Specify the content to print
      />

      <TableContainer component={Paper} ref={tableRef} className='printable'>
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
                    <h2 className="text-lg">Patient Records</h2>
                    <p>Date: {new Date().toLocaleDateString()}</p>
                  </header>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Photo</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Sex</TableCell>
              <TableCell>Passport Number</TableCell>
              <TableCell>Issuing Country</TableCell>
              <TableCell>Occupation</TableCell>
              <TableCell>Height (cm)</TableCell>
              <TableCell>Weight (kg)</TableCell>
              <TableCell>Medical Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((p) => (
              <TableRow key={p._id}>
                <TableCell>
                  {p.photo ? <img src={p.photo} alt="Patient" style={{ width: '50px', height: 'auto' }} /> : '-'}
                </TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.age}</TableCell>
                <TableCell>{p.sex}</TableCell>
                <TableCell>{p.passportNumber}</TableCell>
                <TableCell>{p.issuingCountry || '-'}</TableCell>
                <TableCell>{p.occupation || '-'}</TableCell>
                <TableCell>{p.height || '-'}</TableCell>
                <TableCell>{p.weight || '-'}</TableCell>
                <TableCell>{p.medicalType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <footer className="mt-4 text-center">
          <QRCodeCanvas value='' size={128} />
          <p>Thank you for choosing our health center!</p>
        </footer>
      </TableContainer>

      <Typography variant="h5" align="center" gutterBottom style={{ marginTop: '20px' }}>
        Medical Type Statistics
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={medicalTypeCounts}>
          <XAxis dataKey="type" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <ToastContainer />
    </Container>
  );
};

export default FrontOffice;
