const mongoose = require("mongoose");
const ModelNames = require("./model-name-constants");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "An email address is required"],
    },
    password: {
      type: String,
      required: [true, "A password is required"],
    },
    name: {
      type: String,
      required: [true, "A name is required"],
    },
    expenses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: ModelNames.EXPENSE_MODEL_NAME,
      },
    ],
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: ModelNames.TAG_MODEL_NAME,
      },
    ],
  },
  { versionKey: false, timestamps: true },
);

const UserModel = mongoose.model(ModelNames.USER_MODEL_NAME, UserSchema);

module.exports = UserModel;
