const express = require('express');
const labRoutes = express.Router();
const {
  createLabReport,
  getLabReports,
  getLabReportsByPatient,
  getLabReportById,
  updateLabReport,
  deleteLabReport
} = require('../controllers/labController');
const { createLabNumber } = require('../controllers/labNumberController')

labRoutes.post('/', createLabReport);
labRoutes.get('/', getLabReports);
labRoutes.get('/patient/:patientId', getLabReportsByPatient);
labRoutes.get('/:id', getLabReportById);
labRoutes.put('/:id', updateLabReport);
labRoutes.delete('/:id', deleteLabReport);

labRoutes.post('/generate', createLabNumber)

module.exports = labRoutes;