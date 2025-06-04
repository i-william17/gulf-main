const mongoose = require('mongoose');

const accountsSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    accountNumber: { type: String, required: true, unique: true },
    modeOfPayment: { type: String, required: true },
    commission: { type: Number, required: true },
    xrayPayment: { type: Number, required: true },
    amountDue: { type: Number, required: true },
    amountPaid: { type: Number, required: true },
    paymentStatus: { type: String, required: true },
    paymentDate: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model('accounts', accountsSchema);
