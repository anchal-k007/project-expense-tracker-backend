module.exports = (errObject, statusCode = 500) => {
  let err;
  if (typeof errObject == "string") {
    err = new Error(errObject);
  } else {
    err = new Error(errObject.message);
    err.errors = errObject.errors;
  }
  err.statusCode = statusCode;
  err.isOperationalError = true;
  return err;
};

/**
 * errObject can be of 2 types
 * 
 * 1. string -> will be set as the error message
 * 2. 
    {
      message: will be set as the error message
      errors: {
        format to be decided. most probably used for validation errors
      }
    }
 */
