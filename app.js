const fs = require("fs");
const path = require("path");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const HttpError = require("./models/http-error");

const countRoutes = require("./routes/count-reports");
const authRoutes = require("./routes/auth");
const user = require("./routes/user");
const foundItemReportRoutes = require("./routes/founditems-report");
const lostItemsReportRoutes = require("./routes/lostitems-report");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use("/auth", authRoutes);
app.use("/userlist", user);
app.use("/home", countRoutes);
app.use("/found-report", foundItemReportRoutes);
app.use("/lost-report", lostItemsReportRoutes);

app.use((req, res, next) => {
  return next(new HttpError("Could not find this route", 404));
});

app.use((error, req, res, next) => {
  if (req.files) {
    req.files.map((file) => {
      fs.unlink(file.path, (err) => {
        console.log(err);
      });
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occured!" });
});

mongoose
  .connect(
    "mongodb+srv://usama_saif:safecityservices@cluster0.6q0wl.mongodb.net/safeCityServices?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => console.log(err));
