const HttpError = require("../models/http-error");
const User = require("../models/auth");

//getting user list from admin
const getUserList = async (req, res, next) => {
  let userList;
  try {
    userList = await User.find();
  } catch (err) {
    return next(new HttpError("Fetching all user list is failed!", 500));
  }
  if (!userList || userList.length === 0) {
    return next(new HttpError("Could not find user list", 404));
  }
  res.json(userList.map((user) => user.toObject({ getters: true })));
};

exports.getUserList = getUserList;
