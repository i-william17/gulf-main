const express = require('express');
const router = express.Router();
const { getRadiologyTests, createRadiologyTest } = require('../controllers/radiologyController');

router.get('/', getRadiologyTests);
router.post('/', createRadiologyTest);

module.exports = router;