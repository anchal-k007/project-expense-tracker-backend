require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");

const expenseRouter = require("./routes/expense-router");
const authRouter = require("./routes/auth-routes");
const queryRouter = require("./routes/query-router");
const errorController = require("./controllers/error-controller");
const errorCreator = require("./utils/error-creator");

const app = express();

const testConnection = async () => {
  const {
    MONGODB_CONNECTION_URL,
    MONGODB_USERNAME,
    MONGODB_PASSWORD,
    MONGODB_COLLECTION_NAME_DEV,
    MONGODB_COLLECTION_NAME_PROD,
    NODE_ENV,
  } = process.env;
  const connectionString = MONGODB_CONNECTION_URL.replace(
    "<db_username>",
    MONGODB_USERNAME
  )
    .replace("<db_password>", MONGODB_PASSWORD)
    .replace(
      "<db_collection_name>",
      NODE_ENV === "production" || NODE_ENV === "prod"
        ? MONGODB_COLLECTION_NAME_PROD
        : MONGODB_COLLECTION_NAME_DEV
    );
  mongoose
    .connect(connectionString)
    .then((res) => {
      console.log("connection successful");
    })
    .catch((err) => {
      console.log("error");
      throw err;
    });
};

app.use(bodyParser.json()); // accepts application/json data

// Headers are set here to avoid running into CORS error
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
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/query", queryRouter);

app.use(helmet());

app.get("/check", (req, res, next) => {
  console.log("Request received");
  res.status(200).json({
    message: "success",
  });
});

app.use("*", (req, res, next) => {
  return next(errorCreator(`${req.originalUrl} is an invalid route`, 404));
});

app.use(errorController);

const run = async () => {
  try {
    await testConnection();
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (err) {
    console.log("An error occureed");
    console.log(err);
    process.exit(1);
  }
};

run();
