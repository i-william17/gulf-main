const Lab = require('../models/lab');

exports.createLabReport = async (req, res) => {
  try {
    const labData = {
      patientId: req.body.patientId,
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
      data: labReports
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.getLabReportsByPatient = async (req, res) => {
  try {
    const labReports = await Lab.find({ patientId: req.params.patientId })
      .sort({ timeStamp: -1 });
    
    res.status(200).json({
      success: true,
      data: labReports
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.getLabReportById = async (req, res) => {
  try {
    const labReport = await Lab.findById(req.params.id);
    
    if (!labReport) {
      return res.status(404).json({
        success: false,
        error: 'Lab report not found'
      });
    }

    res.status(200).json({
      success: true,
      data: labReport
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
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
        runValidators: true
      }
    );

    if (!labReport) {
      return res.status(404).json({
        success: false,
        error: 'Lab report not found'
      });
    }

    res.status(200).json({
      success: true,
      data: labReport
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.deleteLabReport = async (req, res) => {
  try {
    const labReport = await Lab.findByIdAndDelete(req.params.id);

    if (!labReport) {
      return res.status(404).json({
        success: false,
        error: 'Lab report not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
