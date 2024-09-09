const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "An email address is required"]
  },
  password: {
    type: String,
    required: [true, "A password is required"]
  },
  name: {
    type: String,
    required: [true, "A name is required"]
  },
  expenses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExpenseModel"
  }]
}, {versionKey: false});

module.exports = mongoose.model("User", UserSchema);