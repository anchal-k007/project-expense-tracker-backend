const express = require("express");
const {
  getAllExpenses,
  postAddNewExpense,
  deleteRemoveExpense,
  putUpdateExpense,
} = require("../controllers/expense-controller");
const { isAuth } = require("../controllers/auth-controller");

const router = express.Router();

router.get("/get-expenses", isAuth, getAllExpenses);

router.post("/new", isAuth, postAddNewExpense);

router
  .delete("/delete/:expenseId", isAuth, deleteRemoveExpense)
  .put("/update/:expenseId", isAuth, putUpdateExpense);

module.exports = router;
