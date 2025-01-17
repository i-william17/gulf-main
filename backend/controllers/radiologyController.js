const RadiologyTest = require('../models/radiology');

exports.getRadiologyTests = async (req, res) => {
    try {
        const tests = await RadiologyTest.find();
        res.status(200).json(tests);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error(error);
    }
};

exports.createRadiologyTest = async (req, res) => {
    const {
        patientId,
        patientName,
        labNumber,
        chestXRayTest,
        heafMantouxTest,
        urineTest = {},
        bloodTest = {},
        fullHaemogram = {},
        liverFunction = {},
        renalFunction = {},
        labRemarks = {},
        patientImage,
        timestamp,
        area1,
    } = req.body;

    console.log(req.body);

    // Validate required fields
    if (!patientName || !labNumber || !chestXRayTest || !heafMantouxTest || !area1) {
        return res.status(400).json({
            message: "Missing required fields: patientName, labNumber, chestXRayTest, heafMantouxTest, or area1",
        });
    }

    // Create a new radiology test object
    const newTest = new RadiologyTest({
        patientId: patientId || null, // Handle optional patientId
        patientName,
        labNumber,
        chestXRayTest,
        heafMantouxTest,
        area1: {
            bloodGroup: area1.bloodGroup || "",
            pregnancyTest: area1.pregnancyTest || "",
            vdrlTest: area1.vdrlTest || "",
        },
        urineTest: {
            albumin: urineTest.albumin || "",
            sugar: urineTest.sugar || "",
            microscopic: urineTest.microscopic || "",
            reaction: urineTest.reaction || "",
        },
        bloodTest: {
            hivTest: bloodTest.hivTest || "",
            hbsAg: bloodTest.hbsAg || "",
            hcv: bloodTest.hcv || "",
            esr: bloodTest.esr || "",
        },
        fullHaemogram: {
            gran: fullHaemogram.gran || { value: '', units: '', status: '', range: '' },
            hct: fullHaemogram.hct || { value: '', units: '', status: '', range: '' },
            hgb: fullHaemogram.hgb || { value: '', units: '', status: '', range: '' },
            lym: fullHaemogram.lym || { value: '', units: '', status: '', range: '' },
            mch: fullHaemogram.mch || { value: '', units: '', status: '', range: '' },
            mchc: fullHaemogram.mchc || { value: '', units: '', status: '', range: '' },
            mcv: fullHaemogram.mcv || { value: '', units: '', status: '', range: '' },
            mid: fullHaemogram.mid || { value: '', units: '', status: '', range: '' },
            mpv: fullHaemogram.mpv || { value: '', units: '', status: '', range: '' },
            pct: fullHaemogram.pct || { value: '', units: '', status: '', range: '' },
            pdw: fullHaemogram.pdw || { value: '', units: '', status: '', range: '' },
            plcr: fullHaemogram.plcr || { value: '', units: '', status: '', range: '' },
            plt: fullHaemogram.plt || { value: '', units: '', status: '', range: '' },
            rbc: fullHaemogram.rbc || { value: '', units: '', status: '', range: '' },
            rwd: fullHaemogram.rwd || { value: '', units: '', status: '', range: '' },
            wbc: fullHaemogram.wbc || { value: '34', units: '', status: 'normal', range: '' }, // Defaulting to provided value
        },
        liverFunction: {
            albumin1: liverFunction.albumin1 || { value: '', status: '', range: '' },
            alkalinePhosphate: liverFunction.alkalinePhosphate || { value: '', status: '', range: '' },
            directBilirubin: liverFunction.directBilirubin || { value: '', status: '', range: '' },
            gammaGt: liverFunction.gammaGt || { value: '', status: '', range: '' },
            indirectBilirubin: liverFunction.indirectBilirubin || { value: '', status: '', range: '' },
            sgot: liverFunction.sgot || { value: '', status: '', range: '' },
            sgpt: liverFunction.sgpt || { value: '', status: '', range: '' },
            totalBilirubin: liverFunction.totalBilirubin || { value: '34', status: 'normal', range: '' },
            totalProteins: liverFunction.totalProteins || { value: '', status: '', range: '' },
        },
        renalFunction: {
            creatinine: renalFunction.creatinine || { value: '', status: '', range: '' },
            fastingBloodSugar: renalFunction.fastingBloodSugar || { value: '', status: '', range: '' },
            urea: renalFunction.urea || { value: '56', status: 'normal', range: '54' }, // Defaulting to provided value
        },
        labRemarks: {
            fitnessEvaluation: {
                otherAspectsFit: labRemarks?.fitnessEvaluation?.otherAspectsFit || "",
                overallStatus: labRemarks?.fitnessEvaluation?.overallStatus || "",
            },
            labSuperintendent: {
                name: labRemarks?.labSuperintendent?.name || "",
            },
        },
        patientImage,
        timeStamp: timestamp || Date.now(), // Use provided timestamp or default to current time
    });

    try {
        // Save the new test entry to the database
        const savedTest = await newTest.save();
        res.status(201).json(savedTest);
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.error(error);
    }
};
