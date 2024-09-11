module.exports = (message, statusCode = 500) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.isOperationalError = true;
  return err;
}