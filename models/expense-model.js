const mongoose = require("mongoose");
const ModelNames = require("./model-name-constants");

const ExpenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "An expense must have an amount"],
    },
    date: {
      type: Date,
      required: [true, "An expense must have a date specified"],
    },
    paymentMode: {
      type: String,
      required: true,
      enum: {
        values: ["Cash", "Card", "UPI"],
        message: "{VALUE} is not a supported payment mode",
      },
    },
    reason: {
      type: String,
      required: true,
      minLength: 0,
      maxLength: [80, "Reason can be at max 80 characters long"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ModelNames.USER_MODEL_NAME,
      required: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: ModelNames.TAG_MODEL_NAME,
      },
    ],
  },
  { versionKey: false, timestamps: true },
);

const ExpenseModel = mongoose.model(ModelNames.EXPENSE_MODEL_NAME, ExpenseSchema);

module.exports = ExpenseModel;
