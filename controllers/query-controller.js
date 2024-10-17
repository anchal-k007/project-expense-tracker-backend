const ExpenseModel = require("../models/expense-model");
const errorCreator = require("../utils/error-creator");

exports.getAllDocuments = async (req, res, next) => {
  const { userId } = req.userId;
  const { startDate, endDate } = req.query;
  if (!Date.parse(startDate) || !Date.parse(endDate)) {
    return next(errorCreator("Invalid startDate or endDate", 404));
  }
  if (startDate > endDate) {
    return next(errorCreator("startDate cannot be greater than endDate", 404));
  }
  try {
    const docs = await ExpenseModel.find({
      user: userId,
      date: { $gte: startDate },
      date: { $lte: endDate },
    });
    console.log(docs);
    return res.status(200).json({
      message: "success",
      data: docs
    });
  } catch (err) {
    console.log("An error occurred while querying");
    return next(err);
  }
};
