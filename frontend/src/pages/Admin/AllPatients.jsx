import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography,
  TextField, IconButton, CircularProgress, TableSortLabel, TablePagination
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import SearchIcon from '@mui/icons-material/Search';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import debounce from 'lodash.debounce';
import * as XLSX from 'xlsx';


const AllPatients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [medicalTypeCounts, setMedicalTypeCounts] = useState([]);
  const [ageDistribution, setAgeDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editablePatient, setEditablePatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/patient');
        setPatients(response.data);
        setFilteredPatients(response.data);
        calculateMedicalTypeCounts(response.data);
        calculateAgeDistribution(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast.error('Failed to fetch patients.');
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const calculateMedicalTypeCounts = (data) => {
    const counts = data.reduce((acc, patient) => {
      acc[patient.medicalType] = (acc[patient.medicalType] || 0) + 1;
      return acc;
    }, {});
    setMedicalTypeCounts(Object.keys(counts).map(type => ({ type, count: counts[type] })));
  };

  const calculateAgeDistribution = (data) => {
    const distribution = data.reduce((acc, patient) => {
      const ageGroup = Math.floor(patient.age / 10) * 10; // Group ages by decade
      acc[ageGroup] = (acc[ageGroup] || 0) + 1;
      return acc;
    }, {});
    setAgeDistribution(Object.keys(distribution).map(age => ({ ageGroup: `${age} - ${parseInt(age) + 9}`, count: distribution[age] })));
  };

  const handleSearch = debounce((term) => {
    setFilteredPatients(
      patients.filter(p => p.name.toLowerCase().includes(term.toLowerCase()))
    );
  }, 300);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, patients]);

  const handleOpenModal = (patient) => {
    setSelectedPatient(patient);
    setEditablePatient({ ...patient });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedPatient(null);
    setEditablePatient(null);
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`http://localhost:5000/api/patient/${editablePatient._id}`, editablePatient);
      toast.success('Patient details updated successfully!');
      setPatients(prev => prev.map(p => (p._id === editablePatient._id ? editablePatient : p)));
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to save changes.');
    }
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
    setFilteredPatients(
      [...filteredPatients].sort((a, b) => {
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
      })
    );
  };

  const handlePageChange = (event, newPage) => setPage(newPage);
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const exportToExcel = () => {
    const sheetData = filteredPatients.map(record => ({
      PatientName: record.name,
      Age: record.age,
      Sex: record.sex,
      PassportNumber: record.passportNumber,
      MedicalType: record.medicalType,
      Address: record.address,
      ContactNumber: record.contactNumber,
      DateOfBirth: record.dateOfBirth,
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Patients');
    XLSX.writeFile(workbook, 'patients_data.xlsx');
  };

  const paginatedData = filteredPatients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="p-8">
      <ToastContainer />
      <Typography variant="h4" align="center" gutterBottom>All Patients</Typography>

      <div className="mb-4 flex justify-between items-center">
        <TextField
          variant="outlined"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: <IconButton><SearchIcon /></IconButton>,
          }}
          fullWidth
        />
        <div>
          <Button variant="contained" color="secondary" onClick={exportToExcel}>Export Excel</Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={medicalTypeCounts} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                {medicalTypeCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][index % 4]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ageGroup" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>

          <TableContainer component={Paper} className="shadow-lg">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {["Name", "Age", "Sex", "Passport Number", "Medical Type", "IssuingCountry", "Occupation", "Height", "Weight"].map((col) => (
                      <TableCell key={col}>
                        <TableSortLabel
                          active={sortConfig.key === col}
                          direction={sortConfig.direction}
                          onClick={() => handleSort(col)}
                        >
                          {col.charAt(0).toUpperCase() + col.slice(1)}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.map(patient => (
                    <TableRow key={patient._id}>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{patient.sex}</TableCell>
                      <TableCell>{patient.passportNumber}</TableCell>
                      <TableCell>{patient.medicalType}</TableCell>
                      <TableCell>{patient.issuingCountry}</TableCell>
                      <TableCell>{patient.occupation}</TableCell>
                      <TableCell>{patient.height}</TableCell>
                      <TableCell>{patient.weight}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleOpenModal(patient)}>Show</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredPatients.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </>
      )}
    </div>
  );
};

export default AllPatients;
