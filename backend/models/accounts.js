const mongoose = require('mongoose');

const accountsSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    accountNumber: { type: String, required: true, unique: true },
    amountDue: { type: Number, required: true },
    amountPaid: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['Paid', 'Pending'], required: true },
    paymentDate: { type: Date, required: true, default: Date.now }, // Added default date
});

module.exports = mongoose.model('accounts', accountsSchema);
