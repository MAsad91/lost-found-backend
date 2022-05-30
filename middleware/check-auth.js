const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  // if (req.method === "OPTIONS") {
  //   next();
  // }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Authentication failed!");
    }
    const decodedToken = jwt.verify(token, "secret_key_of_safe_city_services");
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    return next(new HttpError("Authentication is failed", 401));
  }
};

// const jwt = require("jsonwebtoken");

// const HttpError = require("../models/http-error");

// module.exports = (req, res, next) => {
//   // if (req.method === "OPTIONS") {
//   //   next();
//   // }
//   console.log("f", req.headers.authorization);
//   try {
//     const token = req.headers.authorization.split(" ")[1];
//     if (!token) {
//       throw new Error("Authentication failed!");
//     }
//     const decodedToken = jwt.verify(token, "secret_key_of_safe_city_services");
//     req.userData = { userId: decodedToken.userId };
//     next();
//   } catch (err) {
//     console.log("error:::", err);
//     return res
//       .status(err.code || 500)
//       .json({ message: err.message || "An unknown error occured!" });
//   }
// };
