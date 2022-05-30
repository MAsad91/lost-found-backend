const express = require("express");

const userControllers = require("../controllers/user-controllers");

const router = express.Router();

//getting user list from admin
router.get("/", userControllers.getUserList);

module.exports = router;
