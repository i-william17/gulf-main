const mongoose = require("mongoose");

const radiologySchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient", // Linking the patient document to the radiology report
    required: false,
  },
  patientName: {
    type: String,
    required: true,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
  patientImage: {
    type: String, // Storing image as a base64 string
    required: true,
  },
  labNumber: {
    type: String,
    required: true,
  },
  heafMantouxTest: {
    type: String,
    required: true,
  },
  chestXRayTest: {
    type: String,
    required: true,
  },
  area1: {
    stoolConsistency: { type: String },
    stoolMicroscopy: { type: String },
    tpha: { type: String },
    vdrlTest: { type: String },
    venerealDisease: { type: String },
    pregnancyTest: { type: String },
    typhoid: { type: String },
    hydrocele: { type: String },
    otherDeformities: { type: String },
    earRight: { type: String },
    earLeft: { type: String },
    lungs: { type: String },
    liver: { type: String },
    spleen: { type: String },
    bloodGroup: { type: String },
  },
  urineTest: {
    albumin: { type: String },
    sugar: { type: String },
    microscopic: { type: String },
    reaction: { type: String },
  },
  bloodTest: {
    hivTest: { type: String },
    hbsAg: { type: String },
    hcv: { type: String },
    esr: { type: String },
  },
  fullHaemogram: {
    wbc: {
      value: { type: String },
      units: { type: String },
      status: { type: String },
      range: { type: String },
    },
    lym: {
      value: { type: String },
      units: { type: String },
      status: { type: String },
      range: { type: String },
    },
    mid: {
      value: { type: String },
      units: { type: String },
      status: { type: String },
      range: { type: String },
    },
    gran: {
      value: { type: String },
      units: { type: String },
      status: { type: String },
      range: { type: String },
    },
    rbc: {
      value: { type: String },
      units: { type: String },
      status: { type: String },
      range: { type: String },
    },
    mcv: {
      value: { type: String },
      units: { type: String },
      status: { type: String },
      range: { type: String },
    },
    hgb: {
      value: { type: String },
      units: { type: String },
      status: { type: String },
      range: { type: String },
    },
    hct: {
      value: { type: String },
      units: { type: String },
      status: { type: String },
      range: { type: String },
    },
    mch: {
      value: { type: String },
      units: { type: String },
      status: { type: String },
      range: { type: String },
    },
    mchc: {
      value: { type: String },
      units: { type: String },
      status: { type: String },
      range: { type: String },
    },
    rwd: {
      value: { type: String },
      units: { type: String },
      status: { type: String },
      range: { type: String },
    },
    plcr: {
      value: { type: String },
      units: { type: String },
      status: { type: String },
      range: { type: String },
    },
    plt: {
      value: { type: String },
      units: { type: String },
      status: { type: String },
      range: { type: String },
    },
    mpv: {
      value: { type: String },
      units: { type: String },
      status: { type: String },
      range: { type: String },
    },
    pct: {
      value: { type: String },
      units: { type: String },
      status: { type: String },
      range: { type: String },
    },
    pdw: {
      value: { type: String },
      units: { type: String },
      status: { type: String },
      range: { type: String },
    },
  },
  liverFunction: {
    totalBilirubin: {
      value: { type: String },
      status: { type: String },
      range: { type: String },
    },
    directBilirubin: {
      value: { type: String },
      status: { type: String },
      range: { type: String },
    },
    indirectBilirubin: {
      value: { type: String },
      status: { type: String },
      range: { type: String },
    },
    sgot: {
      value: { type: String },
      status: { type: String },
      range: { type: String },
    },
    sgpt: {
      value: { type: String },
      status: { type: String },
      range: { type: String },
    },
    gammaGt: {
      value: { type: String },
      status: { type: String },
      range: { type: String },
    },
    alkalinePhosphate: {
      value: { type: String },
      status: { type: String },
      range: { type: String },
    },
    totalProteins: {
      value: { type: String },
      status: { type: String },
      range: { type: String },
    },
    albumin1: {
      value: { type: String },
      status: { type: String },
      range: { type: String },
    },
  },
  renalFunction: {
    urea: {
      value: { type: String },
      status: { type: String },
      range: { type: String },
    },
    creatinine: {
      value: { type: String },
      status: { type: String },
      range: { type: String },
    },
    fastingBloodSugar: {
      value: { type: String },
      status: { type: String },
      range: { type: String },
    },
  },
  labRemarks: {
    fitnessEvaluation: {
      otherAspectsFit: { type: String },
      overallStatus: { type: String },
    },
    labSuperintendent: {
      name: { type: String },
    },
  },
});

module.exports = mongoose.model("RadiologyTest", radiologySchema);
