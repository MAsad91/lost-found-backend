const HttpError = require("../models/http-error");

const LostItemsReport = require("../models/lostitems-reports");
const FoundItemsReport = require("../models/founditems-reports");

//Getting report counts of all user for admin
const getAllReportsCount = async (req, res, next) => {
  let 
    lostItemsReportCount,
    foundItemsReportCount;

  try {
    
    lostItemsReportCount = await LostItemsReport.countDocuments();
    foundItemsReportCount = await FoundItemsReport.countDocuments();
    
  } catch (err) {
    return next(
      new HttpError("Counting Report is Failed,Please try again!", 500)
    );
  }
  res.json({
    
    lostItemsReportCount,
    foundItemsReportCount,
  });
};

//getting crime reports count
const getUserReportsCount = async (req, res, next) => {
  const userId = req.params.userId;

  let 
    lostItemsReportCount,
    foundItemsReportCount;

  try {
    lostItemsReportCount = await LostItemsReport.countDocuments({
      creator: userId,
    });
    foundItemsReportCount = await FoundItemsReport.countDocuments({
      creator: userId,
    });
  } catch (err) {
    return next(
      new HttpError("Counting Report is Failed,Please try again!", 500)
    );
  }
  res.json({
    lostItemsReportCount,
    foundItemsReportCount,
  });
};

exports.getAllReportsCount = getAllReportsCount;
exports.getUserReportsCount = getUserReportsCount;
