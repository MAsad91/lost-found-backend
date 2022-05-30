const express = require("express");
const { check } = require("express-validator");

const lostReportControllers = require("../controllers/lostitemreports-controllers");
const fileUpload = require("../middleware/fileUpload");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// //getting user lost items reports by their name
// router.get("/:userId", lostReportControllers.getLostItemsReportsByUserId);

//getting lost items reports
router.get("/", lostReportControllers.getLostItemsReports);

// router.use(checkAuth);

//creating user lost items reports
router.post(
  "/reportform",
  checkAuth,
  fileUpload.array("images", 5),
  [
    check("name").not().isEmpty().isLength({ min: 3 }),
    check("itemname").not().isEmpty().isLength({ min: 4 }),
    check("state").not().isEmpty().isLength({ min: 3 }),
    check("lostitemtype").not().isEmpty(),
    check("color").not().isEmpty().isLength({ min: 3 }),
    check("location").not().isEmpty().isLength({ min: 4 }),
    check("details").not().isEmpty().isLength({ min: 4 }),
    check("description").not().isEmpty().isLength({ min: 15 }),
  ],
  lostReportControllers.createLostItemsReport
);

//deleting report by their id
router.delete("/:reportId", lostReportControllers.deleteReport);

module.exports = router;
