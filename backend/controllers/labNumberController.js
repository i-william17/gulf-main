const mongoose = require("mongoose");
const express = require("express");
const LabNumber = require("../models/LabNumber");

// Controller to handle lab number submission
exports.createLabNumber = async (req, res) => {
  const { number, patient } = req.body;

  try {
    const newLabNumber = new LabNumber({ number, patient });
    const savedLabNumber = await newLabNumber.save();
    res.status(201).json({
      success: true,
      labNumber: savedLabNumber,
      message: "Lab number created successfully",
    });
  } catch (error) {
    console.error("Error creating lab number:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create lab number",
    });
  }
};

// Controller to get all lab numbers
exports.getAllLabNumbers = async (req, res) => {
  try {
    const labNumbers = await LabNumber.find(); // Fetch all lab numbers from the database
    res.status(200).json({
      success: true,
      labNumbers, // Return all lab numbers
    });
  } catch (error) {
    console.error('Error fetching lab numbers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lab numbers',
    });
  }
};

exports.deleteLabNumber = async (req, res) => {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    try {
        const deleted = await LabNumber.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: 'Lab number not found' });
        }

        res.json({ message: 'Lab number deleted successfully' });
    } catch (err) {
        console.error('DELETE error:', err);
        res.status(500).json({ error: 'Server error while deleting' });
    }
};
