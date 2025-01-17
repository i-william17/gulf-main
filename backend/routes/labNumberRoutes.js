const express = require('express');
const labNumberRoutes = express.Router();
const { createLabNumber, getAllLabNumbers } = require('../controllers/labNumberController')

labNumberRoutes.post('/', createLabNumber);
labNumberRoutes.get('/', getAllLabNumbers);

module.exports = labNumberRoutes;