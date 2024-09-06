const express = require("express");
const bodyParser = require("body-parser");

const expenseRouter = require("./routes/expense-router");

const app = express();

app.use(bodyParser.json());   // accepts application/json data

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

app.use("/api/v1/expenses", expenseRouter);

app.get("/check", (req, res, next) => {
  console.log("Request received");
  res.status(200).json({
    statusCode: 200,
    data: "Check complete",
  });
});

app.listen(4000, () => {
  console.log("Server started on port 4000");
});
