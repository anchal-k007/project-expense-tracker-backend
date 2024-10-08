const express = require("express");
const { signup, login, isAuth, verify } = require("../controllers/auth-controller");
const { signupValidator, loginValidator } = require("../middlewares/validation-middlewares");
const catchValidationErrors = require("../middlewares/catch-validation-errors");

const router = express.Router();

router.post("/signup", signupValidator, catchValidationErrors, signup);

router.post("/login", loginValidator, catchValidationErrors, login);

router.get("/verify", isAuth, verify);

module.exports = router;