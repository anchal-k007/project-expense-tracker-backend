const UserModel = require("../models/user-model");
const ExpenseModel = require("./../models/expense-model");
const TagModel = require("../models/tag-model");
const errorCreator = require("../utils/error-creator");

exports.getAllExpenses = async (req, res, next) => {
  try {
    const { date } = req.query;
    const userId = req.userId;
    let filteredExpenses;
    if (!date) {
      filteredExpenses = await ExpenseModel.find({ user: userId })
        .populate({ path: "tags", select: { name: 1, active: 1 } })
        .limit(50);
    } else {
      filteredExpenses = await ExpenseModel.find({
        user: userId,
        date: date,
      }).populate({ path: "tags", select: { name: 1, active: 1 } });
    }
    res.status(200).json({
      expenses: filteredExpenses,
    });
  } catch (err) {
    console.log("error in getting expenses");
    return next(err);
  }
};

exports.postAddNewExpense = async (req, res, next) => {
  const { date, amount, paymentMode, reason, tags } = req.body;
  const userId = req.userId;
  const newExpense = new ExpenseModel({
    date: date,
    amount: +amount,
    paymentMode,
    reason,
    user: userId,
    tags,
  });
  try {
    const createdExpense = await newExpense.save();
    const user = await UserModel.findByIdAndUpdate(userId, {
      $push: { expenses: createdExpense },
    });
    tags.forEach(async (tagId) => {
      await TagModel.findByIdAndUpdate(tagId, {
        $push: { expenses: createdExpense._id },
      });
    });
    res.status(201).json({
      status: "success",
      expense: createdExpense,
    });
  } catch (err) {
    console.log("Error in writing expenses data");
    return next(err);
  }
};

exports.deleteRemoveExpense = async (req, res, next) => {
  const expenseId = req.params.expenseId;
  const userId = req.userId;
  try {
    // Delete the expense
    const deletedExpense = await ExpenseModel.findOneAndDelete({
      _id: expenseId,
      user: userId,
    });

    // Check
    if (!deletedExpense) {
      return next(
        errorCreator(
          `Did not find an expense with the id = ${expenseId} belonging to the user ${userId}`,
          404
        )
      );
    }

    // Update user
    const updatedUser = await UserModel.findByIdAndUpdate(userId, {
      $pull: { expenses: deletedExpense._id },
    });

    // Update tags
    deletedExpense.tags.forEach(async (tagId) => {
      await TagModel.findByIdAndUpdate(tagId, {
        $pull: { expenses: deletedExpense._id },
      });
    });

    return res.status(204).json({
      status: "success",
      message: "Deleted the following expense",
      data: deletedExpense,
    });
  } catch (err) {
    console.log("error occured while deleting");
    return res;
  }
};

exports.putUpdateExpense = async (req, res, next) => {
  const userId = req.userId;
  const validProperties = ["paymentMode", "amount", "date", "reason", "tags"];
  const expenseId = req.params.expenseId;
  const dataToUpdate = req.body;
  // filter unnecessary fields
  Object.keys(dataToUpdate).forEach(
    (key) => !validProperties.includes(key) && delete dataToUpdate[key]
  );

  try {
    // Find the tags before update
    const oldTagsSet = new Set();
    (await ExpenseModel.findById(expenseId, { tags: 1, _id: -1 })).tags.forEach(
      (tagId) => oldTagsSet.add(tagId.toString())
    );

    // Update the expense
    const updatedExpense = await ExpenseModel.findOneAndUpdate(
      { _id: expenseId, user: userId },
      dataToUpdate,
      { runValidators: true, returnDocument: "after" }
    );

    // Check
    if (!updatedExpense) {
      return next(
        errorCreator(`No expense found with the expenseId = ${expenseId}`, 404)
      );
    }

    // Update the tags
    updatedExpense.tags.forEach(async (tagId) => {
      if (oldTagsSet.has(tagId.toString())) {
        // This tag was already present and has not been modified
        oldTagsSet.delete(tagId.toString());
      } else {
        // New tag added to the expense
        await TagModel.findByIdAndUpdate(tagId, {
          $push: { expenses: updatedExpense._id },
        });
      }
    });

    // Tags remaining in the set have been removed from the expense
    const oldTagsArray = Array.from(oldTagsSet);
    oldTagsArray.forEach(async (tagId) => {
      await TagModel.findByIdAndUpdate(tagId, {
        $pull: { expenses: updatedExpense._id },
      });
    });

    return res.status(200).json({
      status: "success",
      updatedExpense,
    });
  } catch (err) {
    console.log("An error occurred while updating");
    return next(err);
  }
};
