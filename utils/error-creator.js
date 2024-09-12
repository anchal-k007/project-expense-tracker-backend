module.exports = (message, statusCode = 500) => {
  let err;
  if(typeof(message) == "string") {
    err = new Error(message);
  } else {
    err = new Error("The following validation errors occurred");
    err.errors = message;
  }
  err.statusCode = statusCode;
  err.isOperationalError = true;
  return err;
}