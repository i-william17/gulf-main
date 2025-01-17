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

