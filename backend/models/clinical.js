const mongoose = require("mongoose");

const clinicalSchema = new mongoose.Schema({
    allergy: { type: String },
    clinicalNotes: { type: String },
    clinicalOfficerName: { type: String, required: true },
    generalExamination: {
        hernia: { type: String },
        leftEye: { type: String },
        rightEye: { type: String },
        varicoseVein: { type: String },
    },
    height: { type: String },
    historyOfPastIllness: { type: String },
    otherTests: {
        earLeft: { type: String },
        liver: { type: String },
    },
    radiologyData: {
        chestXRayTest: { type: String },
        heafMantouxTest: { type: String },
    },
    selectedReport: {
        area1: {
            bloodGroup: { type: String },
            pregnancyTest: { type: String },
            vdrlTest: { type: String },
        },
        bloodTest: {
            esr: { type: String },
            hbsAg: { type: String },
            hcv: { type: String },
            hivTest: { type: String },
        },
        chestXRayTest: { type: String },
        fullHaemogram: {
            gran: { value: { type: String }, units: { type: String }, status: { type: String }, range: { type: String } },
            hct: { value: { type: String }, units: { type: String }, status: { type: String }, range: { type: String } },
            hgb: { value: { type: String }, units: { type: String }, status: { type: String }, range: { type: String } },
            lym: { value: { type: String }, units: { type: String }, status: { type: String }, range: { type: String } },
            mch: { value: { type: String }, units: { type: String }, status: { type: String }, range: { type: String } },
            mchc: { value: { type: String }, units: { type: String }, status: { type: String }, range: { type: String } },
            mcv: { value: { type: String }, units: { type: String }, status: { type: String }, range: { type: String } },
            mid: { value: { type: String }, units: { type: String }, status: { type: String }, range: { type: String } },
            mpv: { value: { type: String }, units: { type: String }, status: { type: String }, range: { type: String } },
            pct: { value: { type: String }, units: { type: String }, status: { type: String }, range: { type: String } },
            pdw: { value: { type: String }, units: { type: String }, status: { type: String }, range: { type: String } },
            plcr: { value: { type: String }, units: { type: String }, status: { type: String }, range: { type: String } },
            plt: { value: { type: String }, units: { type: String }, status: { type: String }, range: { type: String } },
            rbc: { value: { type: String }, units: { type: String }, status: { type: String }, range: { type: String } },
            rwd: { value: { type: String }, units: { type: String }, status: { type: String }, range: { type: String } },
            wbc: { value: { type: String }, units: { type: String }, status: { type: String }, range: { type: String } },
        },
        labNumber: { type: String },
        labRemarks: {
            fitnessEvaluation: {
                otherAspectsFit: { type: String },
                overallStatus: { type: String },
            },
            labSuperintendent: {
                name: { type: String },
            },
        },
        liverFunction: {
            albumin1: { value: { type: String }, status: { type: String }, range: { type: String } },
            alkalinePhosphate: { value: { type: String }, status: { type: String }, range: { type: String } },
            directBilirubin: { value: { type: String }, status: { type: String }, range: { type: String } },
            gammaGt: { value: { type: String }, status: { type: String }, range: { type: String } },
            indirectBilirubin: { value: { type: String }, status: { type: String }, range: { type: String } },
            sgot: { value: { type: String }, status: { type: String }, range: { type: String } },
            sgpt: { value: { type: String }, status: { type: String }, range: { type: String } },
            totalBilirubin: { value: { type: String }, status: { type: String }, range: { type: String } },
            totalProteins: { value: { type: String }, status: { type: String }, range: { type: String } },
        },
        patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
        patientImage: { type: String },
        patientName: { type: String },
        renalFunction: {
            creatinine: { value: { type: String }, status: { type: String }, range: { type: String } },
            fastingBloodSugar: { value: { type: String }, status: { type: String }, range: { type: String } },
            urea: { value: { type: String }, status: { type: String }, range: { type: String } },
        },
        timeStamp: { type: Date, default: Date.now },
        urineTest: {
            albumin: { type: String },
            microscopic: { type: String },
            reaction: { type: String },
            sugar: { type: String },
        },
    },
    systemicExamination: {
        bloodPressure: { type: String },
        heart: { type: String },
        pulseRate: { type: String },
    },
    weight: { type: String },
});

module.exports = mongoose.model("clinical", clinicalSchema);
