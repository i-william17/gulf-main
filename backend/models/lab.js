const mongoose = require("mongoose");

const labSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
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
  urineTest: {
    albumin: String,
    sugar: String,
    microscopic: String,
    reaction: String,
  },
  bloodTest: {
    hivTest: String,
    hbsAg: String,
    hcv: String,
    esr: String,
  },

  area1: {
    stoolConsistency: String,
    stoolMicroscopy: String,
    tpha: String,
    vdrlTest: String,
    venerealDisease: String,
    pregnancyTest: String,
    typhoid: String,
    hydrocele: String,
    otherDeformities: String,
    earRight: String,
    earLeft: String,
    lungs: String,
    liver: String,
    spleen: String,
    bloodGroup: String,
  },
  renalFunction: {
    urea: {
      value: String,
      status: String,
      range: String,
    },
    creatinine: {
      value: String,
      status: String,
      range: String,
    },
    fastingBloodSugar: {
      value: String,
      status: String,
      range: String,
    },
  },
  fullHaemogram: {
    wbc: {
      value: String,
      units: String,
      status: String,
      range: String,
    },
    lym: {
      value: String,
      units: String,
      status: String,
      range: String,
    },
    mid: {
      value: String,
      units: String,
      status: String,
      range: String,
    },
    gran: {
      value: String,
      units: String,
      status: String,
      range: String,
    },
    rbc: {
      value: String,
      units: String,
      status: String,
      range: String,
    },
    mcv: {
      value: String,
      units: String,
      status: String,
      range: String,
    },
    hgb: {
      value: String,
      units: String,
      status: String,
      range: String,
    },
    hct: {
      value: String,
      units: String,
      status: String,
      range: String,
    },
    mch: {
      value: String,
      units: String,
      status: String,
      range: String,
    },
    mchc: {
      value: String,
      units: String,
      status: String,
      range: String,
    },
    rwd: {
      value: String,
      units: String,
      status: String,
      range: String,
    },
    plcr: {
      value: String,
      units: String,
      status: String,
      range: String,
    },
    plt: {
      value: String,
      units: String,
      status: String,
      range: String,
    },
    mpv: {
      value: String,
      units: String,
      status: String,
      range: String,
    },
    pct: {
      value: String,
      units: String,
      status: String,
      range: String,
    },
    pdw: {
      value: String,
      units: String,
      status: String,
      range: String,
    },
  },
  liverFunction: {
    totalBilirubin: {
      value: String,
      status: String,
      range: String,
    },
    directBilirubin: {
      value: String,
      status: String,
      range: String,
    },
    indirectBilirubin: {
      value: String,
      status: String,
      range: String,
    },
    sgot: {
      value: String,
      status: String,
      range: String,
    },
    sgpt: {
      value: String,
      status: String,
      range: String,
    },
    gammaGt: {
      value: String,
      status: String,
      range: String,
    },
    alkalinePhosphate: {
      value: String,
      status: String,
      range: String,
    },
    totalProteins: {
      value: String,
      status: String,
      range: String,
    },
    albumin1: {
      value: String,
      status: String,
      range: String,
    },
  },
  labRemarks: {
    fitnessEvaluation: {
      otherAspectsFit: {
        type: String,
        required: true,
      },
      overallStatus: {
        type: String,
        required: true,
      },
    },
    labSuperintendent: {
      name: {
        type: String,
        required: true,
      },
    },
  },
});

module.exports = mongoose.model("Lab", labSchema);
