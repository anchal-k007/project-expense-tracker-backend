require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Test = require("./models/test-model");
const expenseRouter = require("./routes/expense-router");

const app = express();
const {
  MONGODB_CONNECTION_URL,
  MONGODB_USERNAME,
  MONGODB_PASSWORD,
  MONGODB_COLLECTION_NAME,
} = process.env;

const testConnection = async () => {
  const connectionString = MONGODB_CONNECTION_URL.replace(
    "<db_username>",
    MONGODB_USERNAME
  )
    .replace("<db_password>", MONGODB_PASSWORD)
    .replace("<db_collection_name>", MONGODB_COLLECTION_NAME);
  console.log(connectionString);
  mongoose
    .connect(connectionString)
    .then((res) => {
      console.log("connection successful");
    })
    .catch((err) => {
      console.log("error");
      console.log(err);
    });
};

testConnection()
  .then(async () => {
    console.log("trying to insert data");
    const testData = new Test({
      name: "Hello",
      dob: new Date(2024, 8, 6),
    });
    try {
      const res = await testData.save();
      console.log("data saved successfully");
      console.log(res);
    } catch (err) {
      console.log("an error occurred");
      console.log(err);
    }
  })
  .catch((err) => console.log(err));

app.use(bodyParser.json()); // accepts application/json data

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
    message: "success",
  });
});

app.listen(4000, () => {
  console.log("Server started on port 4000");
});
