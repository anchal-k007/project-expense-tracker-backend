const ExpenseModel = require("../models/expense-model");
const errorCreator = require("../utils/error-creator");

exports.getAllDocuments = async (req, res, next) => {
  const userId = req.userId;
  let { startDate, endDate } = req.query;
  // set startDate and endDate to the beginning and end of the years
  // if no query params are specified
  if (!startDate) startDate = new Date(new Date().getFullYear(), 0, 1);
  if (!endDate) endDate = new Date(new Date().getFullYear() + 1, 0, 1);

  if (!Date.parse(startDate) || !Date.parse(endDate)) {
    return next(errorCreator("Invalid startDate or endDate", 404));
  }
  if (startDate > endDate) {
    return next(errorCreator("startDate cannot be greater than endDate", 404));
  }
  try {
    const docs = await ExpenseModel.find(
      {
        user: userId,
        date: { $gte: startDate, $lte: endDate },
      },
      { amount: 1, date: 1, paymentMode: 1 },
    ).sort({ date: 1 });
    return res.status(200).json({
      message: "success",
      size: docs.length,
      data: docs,
    });
  } catch (err) {
    console.log("An error occurred while querying");
    return next(err);
  }
};
