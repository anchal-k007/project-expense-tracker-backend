const express = require("express");
const {
  getAllExpenses,
  postAddNewExpense,
  deleteRemoveExpense,
  putUpdateExpense,
  getExpenseDetails,
} = require("../controllers/expense-controller");
const { isAuth } = require("../controllers/auth-controller");
const {
  postAddNewExpenseValidator,
  deleteRemoveExpenseValidator,
  putUpdateExpenseValidator,
} = require("../middlewares/validation-middlewares");
const catchValidationErrors = require("../middlewares/catch-validation-errors");

const router = express.Router();

// TODO: deprecate this route after migration
router.get("/get-expenses", isAuth, getAllExpenses);

router
  .route("/:expenseId")
  .get(isAuth, getExpenseDetails)
  .put(isAuth, putUpdateExpenseValidator, catchValidationErrors, putUpdateExpense)
  .delete(isAuth, deleteRemoveExpenseValidator, catchValidationErrors, deleteRemoveExpense);

router
  .route("")
  .get(isAuth, getAllExpenses)
  .post(isAuth, postAddNewExpenseValidator, catchValidationErrors, postAddNewExpense);

// TODO: deprecate this route after migration
router.post("/new", isAuth, postAddNewExpenseValidator, catchValidationErrors, postAddNewExpense);

// TODO: deprecate this route after migration
router
  .delete(
    "/delete/:expenseId",
    isAuth,
    deleteRemoveExpenseValidator,
    catchValidationErrors,
    deleteRemoveExpense,
  )
  .put(
    "/update/:expenseId",
    isAuth,
    putUpdateExpenseValidator,
    catchValidationErrors,
    putUpdateExpense,
  );

module.exports = router;
