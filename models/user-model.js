const mongoose = require("mongoose");
const TagModel = require("./tag-model");

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
        ref: "Expense",
      },
    ],
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
      }
    ],
  },
  { versionKey: false, timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
