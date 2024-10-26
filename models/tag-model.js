const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tag must have a name"],
    },
    active: {
      type: Boolean,
      default: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "A tag must belong to a user"],
    },
    expenses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "expenses",
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

const TagModel = mongoose.model("tag", TagSchema);

module.exports = TagModel;
