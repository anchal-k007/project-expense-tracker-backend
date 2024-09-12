const express = require("express");
const {
  getAllExpenses,
  postAddNewExpense,
  deleteRemoveExpense,
  putUpdateExpense,
} = require("../controllers/expense-controller");
const { isAuth } = require("../controllers/auth-controller");
const {
  postAddNewExpenseValidator,
  deleteRemoveExpenseValidator,
  putUpdateExpenseValidator,
} = require("../middlewares/validation-middlewares");
const catchValidationErrors = require("../middlewares/catch-validation-errors");

const router = express.Router();

router.get("/get-expenses", isAuth, getAllExpenses);

router.post(
  "/new",
  isAuth,
  postAddNewExpenseValidator,
  catchValidationErrors,
  postAddNewExpense
);

router
  .delete(
    "/delete/:expenseId",
    isAuth,
    deleteRemoveExpenseValidator,
    catchValidationErrors,
    deleteRemoveExpense
  )
  .put(
    "/update/:expenseId",
    isAuth,
    putUpdateExpenseValidator,
    catchValidationErrors,
    putUpdateExpense
  );

module.exports = router;
