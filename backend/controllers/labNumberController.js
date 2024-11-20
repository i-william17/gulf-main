const LabNumber = require('../models/labNumber');

exports.createLabNumber = async (req, res) => {
  try {
    const { number, patient } = req.body;

    if (!number || !patient) {
      return res.status(400).json({ message: 'Number and patient are required.' });
    }

    const newLabNumber = new LabNumber({ number, patient });
    await newLabNumber.save();

    res.status(201).json({ message: 'Lab number created successfully', labNumber: newLabNumber });
  } catch (error) {
    console.error('Error creating lab number:', error);
    res.status(500).json({ message: 'Failed to create lab number', error: error.message });
  }
};
