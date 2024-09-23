const express = require("express");
const { signup, login, isAuth } = require("../controllers/auth-controller");
const { signupValidator, loginValidator, verifyToken } = require("../middlewares/validation-middlewares");
const catchValidationErrors = require("../middlewares/catch-validation-errors");

const router = express.Router();

router.post("/signup", signupValidator, catchValidationErrors, signup);

router.post("/login", loginValidator, catchValidationErrors, login);

router.get("/verify", isAuth, verifyToken);

module.exports = router;