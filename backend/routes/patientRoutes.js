const express = require('express');
const multer = require('multer');
const patientController = require('../controllers/patientController');
const patientAccount = require('../controllers/patientAccount')

const patientRoutes = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporary storage for file uploads

//Patient Registration Routes
patientRoutes.get('/', patientController.getAllPatients);
patientRoutes.get('/:id', patientController.getPatientById);
patientRoutes.post('/', upload.single('photo'), patientController.createPatient);
patientRoutes.put('/:id', patientController.updatePatient);
patientRoutes.delete('/:id', patientController.deletePatient);

//Patient Account Routes
patientRoutes.get('/account/:id', patientAccount.getPaymentRecords);
patientRoutes.post('/account', patientAccount.createPayment);
patientRoutes.delete('/account/:id', patientAccount.deletePayment);


module.exports = patientRoutes;
 