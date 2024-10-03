// src/components/Phlebotomy.js
import React, { useState } from 'react';
import { Typography, TextField, Button, Container } from '@mui/material';
import { usePatient } from '../../context/patientContext';

const Phlebotomy = () => {
  const { patientData, updatePatientData } = usePatient();
  const [labNumber, setLabNumber] = useState('');

  const handleLabNumberSubmit = () => {
    updatePatientData({ labNumber });
    alert(`Lab number assigned: ${labNumber}`);
  };

  return (
    <Container>
      <Typography variant="h4" align="center">Phlebotomy</Typography>
      <Typography variant="h6">Patient Name: {patientData?.personalDetails?.name || 'No data'}</Typography>

      <TextField
        label="Lab Number"
        fullWidth
        margin="normal"
        value={labNumber}
        onChange={(e) => setLabNumber(e.target.value)}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLabNumberSubmit}
        style={{ marginTop: '20px' }}
      >
        Assign Lab Number
      </Button>
    </Container>
  );
};

export default Phlebotomy;