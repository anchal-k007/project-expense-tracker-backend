const express = require("express");
const {
  getAllExpenses,
  postAddNewExpense,
  deleteRemoveExpense,
  putUpdateExpense,
} = require("../controllers/expense-controller");

const router = express.Router();

router.get("/get-expenses", getAllExpenses);

router.post("/new", postAddNewExpense);

router.delete("/delete/:expenseId", deleteRemoveExpense);

router.put("/update/:expenseId", putUpdateExpense);

module.exports = router;
