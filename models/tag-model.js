const mongoose = require("mongoose");
const ModelNames = require("./model-name-constants");

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
      ref: ModelNames.USER_MODEL_NAME,
      required: [true, "A tag must belong to a user"],
    },
    expenses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: ModelNames.EXPENSE_MODEL_NAME,
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

const TagModel = mongoose.model(ModelNames.TAG_MODEL_NAME, TagSchema);

module.exports = TagModel;
