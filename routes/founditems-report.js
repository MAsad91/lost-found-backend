const express = require("express");
const { check } = require("express-validator");

const foundReportControllers = require("../controllers/founditemreports-controllers");
const fileUpload = require("../middleware/fileUpload");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// //getting user found items reports by their name
// router.get("/:userId", foundReportControllers.getFoundItemsReportsByUserId);

//getting found items report
router.get("/", foundReportControllers.getFoundItemsReports);

// router.use(checkAuth);

//creating user found items reports
router.post(
  "/reportform",
  checkAuth,
  fileUpload.array("images", 5),
  [
    check("name").not().isEmpty().isLength({ min: 3 }),
    check("itemname").not().isEmpty().isLength({ min: 4 }),
    check("state").not().isEmpty().isLength({ min: 3 }),
    check("founditemtype").not().isEmpty(),
    check("color").not().isEmpty().isLength({ min: 3 }),
    check("location").not().isEmpty().isLength({ min: 4 }),
    check("details").not().isEmpty().isLength({ min: 4 }),
    check("description").not().isEmpty().isLength({ min: 15 }),
  ],
  foundReportControllers.createFoundItemsReport
);

//deleting report by their id
router.delete("/:reportId", foundReportControllers.deleteReport);

module.exports = router;
