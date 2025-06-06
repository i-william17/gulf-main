const express = require('express');
const labNumberRoutes = express.Router();
const { createLabNumber, getAllLabNumbers, deleteLabNumber } = require('../controllers/labNumberController')

labNumberRoutes.post('/', createLabNumber);
labNumberRoutes.get('/', getAllLabNumbers);
labNumberRoutes.get('/counter', async (req, res) => {
    try {
        const Counter = require('../models/Counter');
        const counter = await Counter.findOne({ name: 'labNumber' });

        if (!counter) {
            return res.status(404).json({ success: false, message: 'Counter not found' });
        }

        res.status(200).json({ success: true, value: counter.value });
    } catch (error) {
        console.error('Error fetching lab number counter:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch lab number counter' });
    }
});
labNumberRoutes.delete('/:id', deleteLabNumber);


module.exports = labNumberRoutes;