const express = require("express");
const { body } = require("express-validator");
const clinicalController = require("../controllers/clinicalController");

const clinicalRoute = express.Router();

// Routes
clinicalRoute.get("/", clinicalController.getAllReports);

clinicalRoute.post(
  "/",
  [body("clinicalOfficerName").notEmpty().withMessage("Clinical Officer Name is required")],
  clinicalController.createReport
);

clinicalRoute.put("/:id", clinicalController.updateReport);

clinicalRoute.delete("/:id", clinicalController.deleteReport);

module.exports = clinicalRoute;
