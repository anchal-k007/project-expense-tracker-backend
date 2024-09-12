const express = require("express");
const {
  getAllExpenses,
  postAddNewExpense,
  deleteRemoveExpense,
  putUpdateExpense,
} = require("../controllers/expense-controller");
const { isAuth } = require("../controllers/auth-controller");
const { body, param } = require("express-validator");

const router = express.Router();

router.get("/get-expenses", isAuth, getAllExpenses);

router.post(
  "/new",
  isAuth,
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
  body("paymentMode", "weird")
    .trim()
    .custom(async (value) => {
      const validPaymentMode = ["Cash", "Card", "UPI"];
      if (
        validPaymentMode.findIndex((paymentMode) => paymentMode === value) ===
        -1
      )
        throw new Error("Invalid payment mode");
    }),
  postAddNewExpense
);

router
  .delete(
    "/delete/:expenseId",
    isAuth,
    param("expenseId")
      .isMongoId()
      .withMessage((value) => `${value} is not a valid expenseId`),
    deleteRemoveExpense
  )
  .put(
    "/update/:expenseId",
    isAuth,
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
    body("paymentMode", "weird")
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
    putUpdateExpense
  );

module.exports = router;
