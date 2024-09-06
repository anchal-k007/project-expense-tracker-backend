const express = require("express");
const { getAllExpenses, postAddNewExpense } = require("../controllers/expense-controller");
 
const router = express.Router();

router.get("/all", getAllExpenses);

router.post("/new", postAddNewExpense);

module.exports = router;