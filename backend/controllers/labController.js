const Lab = require('../models/lab');
const fs = require('fs');

// Helper function to convert image to base64
const convertImageToBase64 = (filePath) => {
  const imageBuffer = fs.readFileSync(filePath);
  return imageBuffer.toString('base64');
};

exports.createLabReport = async (req, res) => {
  try {
    let patientImageBase64 = '';

    // Check if `patientImage` is provided in the request body
    if (req.body.patientImage) {
      // If it's a file path, convert it to Base64
      if (fs.existsSync(req.body.patientImage)) {
        patientImageBase64 = convertImageToBase64(req.body.patientImage);
      } else {
        // Assume it's already a Base64 string
        patientImageBase64 = req.body.patientImage;
      }
    }

    // Convert uploaded file (if present) to Base64
    if (req.file) {
      patientImageBase64 = convertImageToBase64(req.file.path);
    }

    const labData = {
      patientId: req.body.patientId,
      labNumber: req.body.labNumber,
      patientImage: patientImageBase64, // Store image as Base64
      patientName: req.body.patientName,
      timeStamp: req.body.timeStamp,
      labRemarks: req.body.labRemarks,
      ...req.body.labData,
    };

    const lab = new Lab(labData);
    const savedLab = await lab.save();

    res.status(201).json({
      success: true,
      data: savedLab,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getLabReports = async (req, res) => {
  try {
    const labReports = await Lab.find().sort({ timeStamp: -1 });
    res.status(200).json({
      success: true,
      data: labReports,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getLabReportsByPatient = async (req, res) => {
  try {
    const labReports = await Lab.find({ patientId: req.params.patientId })
      .sort({ timeStamp: -1 });

    res.status(200).json({
      success: true,
      data: labReports,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getLabReportById = async (req, res) => {
  try {
    const labReport = await Lab.findById(req.params.id);

    if (!labReport) {
      return res.status(404).json({
        success: false,
        error: 'Lab report not found',
      });
    }

    res.status(200).json({
      success: true,
      data: labReport,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.updateLabReport = async (req, res) => {
  try {
    const labReport = await Lab.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!labReport) {
      return res.status(404).json({
        success: false,
        error: 'Lab report not found',
      });
    }

    res.status(200).json({
      success: true,
      data: labReport,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.deleteLabReport = async (req, res) => {
  try {
    const labReport = await Lab.findByIdAndDelete(req.params.id);

    if (!labReport) {
      return res.status(404).json({
        success: false,
        error: 'Lab report not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
