const accounts = require('../models/accounts');

// Get all payment records
exports.getPaymentRecords = async (req, res) => {
    try {
        const payments = await accounts.find();
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new payment
exports.createPayment = async (req, res) => {
    const { patientName, accountNumber, amountDue, amountPaid, paymentStatus } = req.body;

    // Validate required fields
    if (!patientName || !accountNumber || amountDue == null || amountPaid == null || !paymentStatus) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const newPayment = new accounts({
        patientName,
        accountNumber,
        amountDue,
        amountPaid,
        paymentStatus
    });

    try {
        const savedPayment = await newPayment.save();
        res.status(201).json(savedPayment);
    } catch (error) {
        // Handle validation error or duplicate entry error (like duplicate accountNumber)
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Account number already exists.' });
        }
        res.status(400).json({ message: error.message });
    }
};

// Delete payment record
exports.deletePayment = async (req, res) => {
    try {
        const deletedPayment = await accounts.findByIdAndDelete(req.params.id);
        if (!deletedPayment) {
            return res.status(404).json({ message: 'Payment record not found' });
        }
        res.status(200).json({ message: 'Payment record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
