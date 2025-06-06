const express = require('express');
const multer = require('multer');
const path = require('path');
const patientController = require('../controllers/patientController');
const patientAccount = require('../controllers/patientAccount')

const patientRoutes = express.Router();

// Multer configuration for saving files with original names and in specific directory
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

//Patient Registration Routes
patientRoutes.get('/', patientController.getAllPatients);
patientRoutes.get('/:id', patientController.getPatientById);
patientRoutes.post('/', upload.single('photo'), patientController.createPatient); // File upload for patient photo
patientRoutes.delete('/:id', patientController.deletePatient);

//Patient Account Routes
patientRoutes.get('/account/:id', patientAccount.getPaymentRecords);
patientRoutes.post('/account', patientAccount.createPayment);
patientRoutes.put('/account/id', patientAccount.updatePayment);
patientRoutes.delete('/:id', patientAccount.deletePayment);

module.exports = patientRoutes;
