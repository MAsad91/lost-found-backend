const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const FoundItemsReport = require("../models/founditems-reports");
const User = require("../models/auth");

//getting found items reports of user by their name
// const getFoundItemsReportsByUserId = async (req, res, next) => {
//   const userId = req.params.userId;

//   let userReport;

//   try {
//     userReport = await FoundItemsReport.find({ creator: userId });
//   } catch (err) {
//     return next(
//       new HttpError("Fetching reports failed, Please try again!", 500)
//     );
//   }

//   if (!userReport || userReport.length === 0) {
//     return next(
//       new HttpError(
//         "Could not find crime reports for the provided username",
//         404
//       )
//     );
//   }

//   res.json(userReport.map((report) => report.toObject({ getters: true })));
// };

//getting found items reports
const getFoundItemsReports = async (req, res, next) => {
  let foundItemsReport;
  try {
    foundItemsReport = await FoundItemsReport.find();
  } catch (err) {
    return next(
      new HttpError("Fetching reports failed, Please try again!", 500)
    );
  }

  if (!foundItemsReport || foundItemsReport.length === 0) {
    return next(new HttpError("Could not find found items reports", 404));
  }

  res.json(
    foundItemsReport.map((report) => report.toObject({ getters: true }))
  );
};

//creating found items report
const createFoundItemsReport = async (req, res, next) => {
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
    founditemtype,
    color,
    location,
    details,
    description,
    creator,
  } = req.body;

  const createdReport = new FoundItemsReport({
    name,
    itemname,
    state,
    founditemtype,
    color,
    location,
    details,
    description,
    images: imagePath,
    creator,
  });

  let user;
  try {
    // user = await User.findById(creator);
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
    // user.founditemsreports.push(createdReport);
    // await user.save({ session: sess });
    await User.updateOne(
      { _id: creator },
      { $push: { founditemsreports: createdReport._id } }
    );
    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError("Creating report is failed. Please try again!"));
  }

  res.status(201).json({ Found_Items_Report: createdReport });
};

const deleteReport = async (req, res, next) => {
  const reportId = req.params.reportId;

  const { creator } = req.body;

  let report;
  try {
    //report = await FoundItemsReport.findById(reportId).populate("creator");
    report = await FoundItemsReport.findOne({ _id: reportId }).populate(
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
    // report.creator.founditemsreports.pull(report);
    // await report.creator.save({ session: sess });
    await User.updateOne(
      { _id: creator },
      { $pull: { founditemsreports: report._id } }
    );
    sess.commitTransaction();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not delete report.", 500)
    );
  }
  res.json({ message: "Deleted Report!" });
};

exports.getFoundItemsReports = getFoundItemsReports;
exports.deleteReport = deleteReport;
exports.createFoundItemsReport = createFoundItemsReport;
//exports.getFoundItemsReportsByUserId = getFoundItemsReportsByUserId;
