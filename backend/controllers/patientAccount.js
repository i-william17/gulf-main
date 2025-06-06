const accounts = require('../models/accounts'); // Import the Account model
const mongoose = require('mongoose');

// Get all payment records
exports.getPaymentRecords = async (req, res) => {
    try {
        const payments = await accounts.find(); // Retrieve all payment records from the database
        res.status(200).json(payments); // Return payment records with a 200 status
    } catch (error) {
        res.status(500).json({ message: error.message }); // Send a 500 error with the error message
    }
};

// Create new payment
exports.createPayment = async (req, res) => {
    const { patientName, modeOfPayment, accountNumber, amountDue, commission, xrayPayment, amountPaid, paymentStatus } = req.body;


    // Validate required fields
    if (!patientName || !accountNumber || amountDue == null || amountPaid == null || !paymentStatus) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const newPayment = new accounts({
        patientName,
        accountNumber,
        modeOfPayment,
        commission,
        xrayPayment,
        amountDue,
        amountPaid,
        paymentStatus
    });

    try {
        const savedPayment = await newPayment.save(); // Save the new payment record to the database
        res.status(201).json(savedPayment); // Return the saved record with a 201 status
    } catch (error) {
        // Handle validation error or duplicate entry error (like duplicate accountNumber)
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Account number already exists.' });
        }
        res.status(400).json({ message: error.message });
    }
};

// Update existing payment record
exports.updatePayment = async (req, res) => {
    const { patientName, modeOfPayment, accountNumber, amountDue, commission, xrayPayment, amountPaid, paymentStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    if (!patientName || !accountNumber || amountDue == null || amountPaid == null || !paymentStatus) {
        return res.status(400).json({ message: 'All required fields must be provided' });
    }

    try {
        const updatedPayment = await accounts.findByIdAndUpdate(
            req.params.id,
            { patientName, modeOfPayment, accountNumber, amountDue, amountPaid, commission, xrayPayment, paymentStatus },
            { new: true, runValidators: true }
        );

        if (!updatedPayment) {
            return res.status(404).json({ message: 'Payment record not found' });
        }

        res.status(200).json(updatedPayment);
    } catch (error) {
        console.error('Error in updatePayment:', error);
        res.status(400).json({ message: error.message });
    }
};

// Delete payment record
exports.deletePayment = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    try {
        const deletedPayment = await accounts.findByIdAndDelete(id);

        if (!deletedPayment) {
            return res.status(404).json({ message: 'Payment record not found' });
        }

        res.status(200).json({ message: 'Payment record deleted successfully', deletedPayment });
    } catch (error) {
        console.error('Error deleting payment record:', error);
        res.status(500).json({ message: error.message });
    }
};
