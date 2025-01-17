const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  passportNumber: { type: String, required: true, unique: true },
  issuingCountry: { type: String, required: false },
  occupation: { type: String, required: false },
  sex: { type: String, required: true },
  age: { type: Number, required: true },
  photo: { type: String, required: false }, // Store image URL
  medicalType: { type: String, required: true },
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
