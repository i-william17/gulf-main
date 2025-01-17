const clinical = require("../models/clinical");
const { validationResult } = require("express-validator");

// Fetch all clinical reports
exports.getAllReports = async (req, res) => {
    try {
        const reports = await clinical.find();
        res.status(200).json(reports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching clinical reports." });
    }
};

// Create a new clinical report
exports.createReport = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {
            selectedReport,
            generalExamination,
            systemicExamination,
            otherTests,
            clinicalNotes,
            clinicalOfficerName,
            height,
            weight,
            historyOfPastIllness,
            allergy,
            radiologyData,
        } = req.body;

        const newReport = new clinical({
            selectedReport,
            generalExamination,
            systemicExamination,
            otherTests,
            clinicalNotes,
            clinicalOfficerName,
            height,
            weight,
            historyOfPastIllness,
            allergy,
            radiologyData,
        });

        const savedReport = await newReport.save();
        res.status(201).json(savedReport);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creating clinical report." });
    }
};

// Update a clinical report
exports.updateReport = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedReport = await clinical.findByIdAndUpdate(id, req.body, {
            new: true,
        });

        if (!updatedReport) {
            return res.status(404).json({ error: "Report not found." });
        }

        res.status(200).json(updatedReport);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error updating clinical report." });
    }
};

// Delete a clinical report
exports.deleteReport = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReport = await clinical.findByIdAndDelete(id);

        if (!deletedReport) {
            return res.status(404).json({ error: "Report not found." });
        }

        res.status(200).json({ message: "Report deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error deleting clinical report." });
    }
};
