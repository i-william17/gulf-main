import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
  const [patientData, setPatientData] = useState({ number: [], patients: [] });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/patient');
        setPatientData((prevState) => ({
          ...prevState,
          patients: response.data,
        }));
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  const updatePatientData = (data) => {
    setPatientData((prevState) => ({
      ...prevState,
      ...data,
    }));
  };

  return (
    <PatientContext.Provider value={{ patientData, updatePatientData }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => {
  return useContext(PatientContext);
};
