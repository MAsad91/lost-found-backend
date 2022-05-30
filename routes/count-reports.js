const express = require("express");

const countReportControllers = require("../controllers/countreport-controllers");

const router = express.Router();

//Getting report counts of all user for admin
router.get("/", countReportControllers.getAllReportsCount);

//Getting count reports of user
router.get("/:userId", countReportControllers.getUserReportsCount);

module.exports = router;
