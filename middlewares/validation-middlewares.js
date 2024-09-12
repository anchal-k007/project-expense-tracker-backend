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
    .withMessage("Maximum length of reason can only be 80"),
  body("paymentMode")
    .trim()
    .custom(async (value) => {
      const validPaymentMode = ["Cash", "Card", "UPI"];
      console.log("checking");
      console.log(
        validPaymentMode.findIndex((paymentMode) => paymentMode === value)
      );
      if (
        validPaymentMode.findIndex((paymentMode) => paymentMode === value) ===
        -1
      )
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
    .withMessage("Maximum length of reason can only be 80"),
  body("paymentMode")
    .optional()
    .trim()
    .custom(async (value) => {
      const validPaymentMode = ["Cash", "Card", "UPI"];
      if (
        validPaymentMode.findIndex((paymentMode) => paymentMode === value) ===
        -1
      )
        throw new Error("Invalid payment mode");
    }),
];
