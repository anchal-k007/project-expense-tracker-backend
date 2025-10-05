const { body, param } = require("express-validator");

exports.postAddNewExpenseValidator = [
  body("amount")
    .trim()
    .notEmpty()
    .isNumeric()
    .custom((value) => value > 0)
    .withMessage("Please enter a valid amount"),
  body("reason")
    .trim()
    .isLength({ max: 80 })
    .withMessage("Maximum length of reason can only be 80")
    .escape(),
  body("paymentMode")
    .trim()
    .custom(async (value) => {
      const validPaymentMode = ["Cash", "Card", "UPI"];
      if (validPaymentMode.findIndex((paymentMode) => paymentMode === value) === -1)
        throw new Error("Invalid payment mode");
    }),
];

exports.deleteRemoveExpenseValidator = [
  param("expenseId")
    .isMongoId()
    .withMessage((value) => `${value} is not a valid expenseId`),
];

exports.putUpdateExpenseValidator = [
  param("expenseId")
    .isMongoId()
    .withMessage((value) => `${value} is not a valid expenseId`),
  body("amount")
    .optional()
    .trim()
    .notEmpty()
    .isNumeric()
    .custom((value) => value > 0)
    .withMessage("Please enter a valid amount"),
  body("reason")
    .optional()
    .trim()
    .isLength({ max: 80 })
    .withMessage("Maximum length of reason can only be 80")
    .escape(),
  body("paymentMode")
    .optional()
    .trim()
    .custom(async (value) => {
      const validPaymentMode = ["Cash", "Card", "UPI"];
      if (validPaymentMode.findIndex((paymentMode) => paymentMode === value) === -1)
        throw new Error("Invalid payment mode");
    }),
];

exports.signupValidator = [
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Minimum length of password required = 5")
    .escape(),
  body("confirmPassword")
    .trim()
    .custom(async (value, { req }) => {
      const password = req.body.password.trim();
      if (password != value) throw new Error("password and confirmPassword do not match");
    }),
  body("email").trim().isEmail().withMessage("Please enter a valid email"),
];

exports.loginValidator = [
  body("email", "Please enter a valid email").trim().isEmail().notEmpty(),
  body("password", "Password cannot be empty").trim().notEmpty().escape(),
];
