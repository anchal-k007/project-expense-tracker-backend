const UserModel = require("../models/user-model");
const ExpenseModel = require("./../models/expense-model");

exports.getAllExpenses = async (req, res, next) => {
  try {
    const { year, month, date } = req.query;
    const userId = req.userId;
    let filteredExpenses;
    if (!year || !month || !date) {
      filteredExpenses = await ExpenseModel.find({ user: userId }).limit(50);
    } else {
      const createdDate = new Date(year, month, date);
      console.log(createdDate.toISOString());
      filteredExpenses = await ExpenseModel.find({
        user: userId,
        date: createdDate.toISOString(),
      });
    }
    res.status(200).json({
      expenses: filteredExpenses,
    });
  } catch (err) {
    console.log(`Error in reading expenses data`);
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "internal server error",
    });
  }
};

exports.postAddNewExpense = async (req, res, next) => {
  const { date, amount, paymentMode, reason } = req.body;
  const userId = req.userId;
  const newExpense = new ExpenseModel({
    date: new Date(date),
    amount: +amount,
    paymentMode,
    reason,
    user: userId,
  });
  try {
    const createdExpense = await newExpense.save();
    const user = await UserModel.findByIdAndUpdate(userId, {
      $push: { expenses: createdExpense },
    });
    res.status(201).json({
      status: "success",
      expense: createdExpense,
    });
  } catch (err) {
    console.log("Error in writing expenses data");
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "internal server error",
    });
  }
};

exports.deleteRemoveExpense = async (req, res, next) => {
  const expenseId = req.params.expenseId;
  const userId = req.userId;
  try {
    const deletedExpense = await ExpenseModel.findOneAndDelete({
      _id: expenseId,
      user: userId,
    });
    if (!deletedExpense) {
      return res.status(404).json({
        status: "fail",
        message: `Did not find an expense with the id = ${expenseId} belonging to the user ${userId}`,
      });
    }
    const updatedUser = await UserModel.findByIdAndUpdate(userId, {
      $pull: { expenses: deletedExpense._id },
    });
    res.status(204).json({
      status: "success",
      message: "Deleted the following expense",
      data: deletedExpense,
    });
  } catch (err) {
    console.log("error occured while deleting");
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.putUpdateExpense = async (req, res, next) => {
  const userId = req.userId;
  const validProperties = ["paymentMode", "amount", "date", "reason"];
  const expenseId = req.params.expenseId;
  const dataToUpdate = req.body;
  // filter unnecessary fields
  Object.keys(dataToUpdate).forEach(
    (key) => !validProperties.includes(key) && delete dataToUpdate[key]
  );

  try {
    const updatedExpense = await ExpenseModel.findOneAndUpdate(
      { _id: expenseId, user: userId },
      dataToUpdate,
      { runValidators: true, returnDocument: "after" }
    );
    if (!updatedExpense) {
      return res.status(404).json({
        status: "fail",
        message: "No expense found with expenseId = " + expenseId,
      });
    }
    res.status(200).json({
      status: "success",
      updatedExpense,
    });
  } catch (err) {
    console.log("An error occurred while updating");
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "internal server error",
    });
  }
};
