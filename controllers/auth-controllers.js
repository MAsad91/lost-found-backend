const HttpError = require("../models/http-error");
const User = require("../models/auth");

const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//user login
const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Logging in is failed,Please try agian!", 500));
  }

  if (!existingUser) {
    return next(new HttpError("Invalid credentials,Please try again!", 401));
  }

  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return next(new HttpError("Could not log you in, please try again", 500));
  }

  if (!isValidPassword) {
    return next(new HttpError("Invalid credentials,Please try again!", 401));
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
        token: token,
      },
      "secret_key_of_safe_city_services",
      {
        expiresIn: "1h",
      }
    );
  } catch (err) {
    return next(
      new HttpError(new HttpError("Logging in is failed,please try again", 500))
    );
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

//user signup
const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Input data is invalid.Please check your data!", 422)
    );
  }

  const { name, email, password, address, contactno } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Signing Up is failed,Please try again!", 500));
  }

  if (existingUser) {
    return next(new HttpError("User exits already,Please login instead!", 422));
  }

  let hashPassword;
  try {
    hashPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(
      new HttpError("Could not create a user, please try again.", 500)
    );
  }

  const createdUser = new User({
    name,
    email,
    password: hashPassword,
    address,
    contactno,
    crimereports: [],
    safelifereports: [],
    lostitemsreports: [],
    founditemsreports: [],
    communityservicesrequests: [],
    certificatespermitsrequests: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    return next(new HttpError("Creating user is failed. Please try again!"));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      "secret_key_of_safe_city_services",
      {
        expiresIn: "1h",
      }
    );
  } catch (err) {
    return next(new HttpError("Signing up is failed,please try again.", 500));
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

exports.login = login;
exports.signUp = signUp;
