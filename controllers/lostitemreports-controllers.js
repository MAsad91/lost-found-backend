const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const LostItemsReport = require("../models/lostitems-reports");
const User = require("../models/auth");

//getting lost items reports of user by their name
// const getLostItemsReportsByUserId = async (req, res, next) => {
//   const userId = req.params.userId;

//   let userReport;

//   try {
//     userReport = await LostItemsReport.find({ creator: userId });
//   } catch (err) {
//     return next(
//       new HttpError("Fetching reports failed, Please try again!", 500)
//     );
//   }

//   if (!userReport || userReport.length === 0) {
//     return next(
//       new HttpError(
//         "Could not find lost items reports for the provided username",
//         404
//       )
//     );
//   }

//   res.json(userReport.map((report) => report.toObject({ getters: true })));
// };

//getting lost items report
const getLostItemsReports = async (req, res, next) => {
  let lostItemsReport;
  try {
    lostItemsReport = await LostItemsReport.find();
  } catch (err) {
    return next(
      new HttpError("Fetching reports failed, Please try again!", 500)
    );
  }

  if (!lostItemsReport || lostItemsReport.length === 0) {
    return next(new HttpError("Could not find lost items reports", 404));
  }

  res.json(lostItemsReport.map((report) => report.toObject({ getters: true })));
};

//creating found items report
const createLostItemsReport = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Input data is invalid.Please check your data!", 422)
    );
  }

  let imagePath = [];
  if (req.files) {
    req.files.map((file) => {
      imagePath.push(file.path);
    });
  }

  const {
    name,
    itemname,
    state,
    lostitemtype,
    color,
    location,
    details,
    description,
    creator,
  } = req.body;

  const createdReport = new LostItemsReport({
    name,
    itemname,
    state,
    lostitemtype,
    color,
    location,
    details,
    description,
    images: imagePath,
    creator,
  });

  let user;
  try {
    //user = await User.findById(creator);
    user = await User.findOne({ _id: creator });
  } catch (err) {
    return next(
      new HttpError("Creating report is failed. Please try again!", 500)
    );
  }

  if (!user) {
    return next(new HttpError("Could not find user for the provided id.", 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdReport.save({ session: sess });
    // user.lostitemsreports.push(createdReport);
    // await user.save({ session: sess });
    await User.updateOne(
      { _id: creator },
      { $push: { lostitemsreports: createdReport._id } }
    );
    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError("Creating report is failed. Please try again!"));
  }

  res.status(201).json({ Lost_Items_Report: createdReport });
};

const deleteReport = async (req, res, next) => {
  const reportId = req.params.reportId;

  const { creator } = req.body;

  let report;
  try {
    //report = await LostItemsReport.findById(reportId).populate("creator");
    report = await LostItemsReport.findOne({ _id: reportId }).populate(
      "creator"
    );
  } catch (err) {
    return next(
      new HttpError("Something went wrong,could not delete report", 500)
    );
  }

  if (!report) {
    return next(new HttpError("Could not find report for this id!", 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await report.remove({ session: sess });
    // report.creator.lostitemsreports.pull(report);
    // await report.creator.save({ session: sess });
    await User.updateOne(
      { _id: creator },
      { $pull: { lostitemsreports: report._id } }
    );
    sess.commitTransaction();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not delete report.", 500)
    );
  }

  res.json({ message: "Deleted Report!" });
};

exports.getLostItemsReports = getLostItemsReports;
exports.deleteReport = deleteReport;
exports.createLostItemsReport = createLostItemsReport;
// exports.getLostItemsReportsByUserId = getLostItemsReportsByUserId;
