const mongoose = require('mongoose');

const labNumberSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    unique: true,
  },
  patient: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('LabNumber', labNumberSchema);
