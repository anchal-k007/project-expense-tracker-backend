const express = require("express");
const { getAllExpenses, postAddNewExpense, deleteRemoveExpense} = require("../controllers/expense-controller");
 
const router = express.Router();

router.get("/all", getAllExpenses);

router.post("/new", postAddNewExpense);

router.delete("/delete/:paymentId", deleteRemoveExpense);

module.exports = router;