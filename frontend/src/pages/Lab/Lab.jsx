// src/components/Lab.js
import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Container, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { usePatient } from '../../context/patientContext';

const Lab = () => {
  const { patientData, updatePatientData } = usePatient();
  const [testResults, setTestResults] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [submittedResults, setSubmittedResults] = useState([]);

  useEffect(() => {
    if (patientData) {
      setSelectedPatient(patientData.labNumber); // Default to the current patient's lab number
    }
  }, [patientData]);

  const handleTestResultsSubmit = () => {
    const newResult = { labNumber: selectedPatient, testResults };
    setSubmittedResults([...submittedResults, newResult]); // Update local state for submitted results
    updatePatientData({ testResults, labNumber: selectedPatient });
    alert('Test results submitted');
    setTestResults(''); // Clear the input after submission
  };

  if (!patientData.labNumber) {
    return <Typography>No lab number assigned. Please go to Phlebotomy first.</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" align="center">Lab Tests</Typography>
      <Typography variant="h6">Lab Number: {patientData.labNumber}</Typography>

      <Select
        value={selectedPatient}
        onChange={(e) => setSelectedPatient(e.target.value)}
        fullWidth
        displayEmpty
      >
        {patientData.patients.map((patient) => (
          <MenuItem key={patient.labNumber} value={patient.labNumber}>
            {patient.name}
          </MenuItem>
        ))}
      </Select>

      <TextField
        label="Enter Test Results"
        multiline
        fullWidth
        rows={4}
        value={testResults}
        onChange={(e) => setTestResults(e.target.value)}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleTestResultsSubmit}
      >
        Submit Test Results
      </Button>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Lab Number</TableCell>
              <TableCell>Test Results</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submittedResults.map((result, index) => (
              <TableRow key={index}>
                <TableCell>{result.labNumber}</TableCell>
                <TableCell>{result.testResults}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Lab;
