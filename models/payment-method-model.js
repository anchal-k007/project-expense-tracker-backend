const mongoose = require("mongoose");
const ModelNames = require("./model-name-constants");

const PaymentMethodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A payment method must have a name"],
    },
    active: {
      type: Boolean,
      default: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ModelNames.USER_MODEL_NAME,
      required: [true, "A payment method must be associated with a user"],
    },
    expenses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: ModelNames.EXPENSE_MODEL_NAME,
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const PaymentMethodModel = mongoose.model(
  ModelNames.PAYMENT_METHOD_MODEL_NAME,
  PaymentMethodSchema,
);

module.exports = PaymentMethodModel;
