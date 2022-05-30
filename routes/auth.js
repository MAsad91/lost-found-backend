const express = require("express");
const { check } = require("express-validator");

const authControllers = require("../controllers/auth-controllers");

const router = express.Router();

//user login
router.post("/login", authControllers.login);

//user signup
router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").not().isEmpty().isEmail(),
    check("password").not().isEmpty().isLength({ min: 7 }),
    check("address").not().isEmpty().isLength({ min: 10 }),
    check("contactno").not().isEmpty().isLength({ min: 11, max: 11 }),
  ],
  authControllers.signUp
);

module.exports = router;
