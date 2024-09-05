const express = require("express");
const { getAllExpenses } = require("../controllers/expense-controller");
 
const router = express.Router();

router.get("/all", getAllExpenses);

module.exports = router;