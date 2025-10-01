const { validationResult } = require("express-validator");
const errorCreator = require("../utils/error-creator");

module.exports = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array().map((obj) => {
      return {
        field: obj.path,
        message: obj.msg,
      };
    });
    const errorObject = {
      message: "The following validation errors occurred",
      errors,
    };
    return next(errorCreator(errorObject, 404));
  }
  // No validation errors present
  next();
};
