const { validationResult } = require("express-validator");
const errorCreator = require("../utils/error-creator");

module.exports = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errorObject = validationErrors.array().map((obj) => {
      return {
        field: obj.path,
        message: obj.msg,
      };
    });
    return next(errorCreator(errorObject, 403));
  }
  // No validation errors present
  next();
};
