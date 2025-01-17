const express = require('express');
const labRoutes = express.Router();
const fs = require('fs');
const {
  createLabReport,
  getLabReports,
  getLabReportsByPatient,
  getLabReportById,
  updateLabReport,
  deleteLabReport
} = require('../controllers/labController');
const { createLabNumber, getAllLabNumbers } = require('../controllers/labNumberController');
const multer = require('multer');

const uploadDirectory = 'uploads/';

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to avoid filename collisions
  }
});

const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

labRoutes.post('/',upload.single('patientImage') ,createLabReport);
labRoutes.get('/', getLabReports);
labRoutes.get('/patient/:patientId', getLabReportsByPatient);
labRoutes.get('/:id', getLabReportById);
labRoutes.put('/:id', updateLabReport);
labRoutes.delete('/:id', deleteLabReport);

labRoutes.post('/generate', createLabNumber)
labRoutes.get('/number', getAllLabNumbers)

module.exports = labRoutes;