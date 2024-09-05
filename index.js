const express = require("express");

const expenseRouter = require("./routes/expense-router");

const app = express();

app.use("/api/v1/expenses", expenseRouter)

app.get("/check", (req, res, next) => {
  console.log("Request received");
  res.status(200).json({
    statusCode: 200,
    data: "Check complete"
  });
});

app.listen(4000, ()=> {
  console.log("Server started on port 4000");
});