module.exports = (err, req, res, next) => {
  if (!err.isOperationalError) console.log(err);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "internal server error";
  err.status = err.statusCode.toString().startsWith("4") ? "fail" : "error";
  const errObject = {
    status: err.status,
    message: err.message,
  };
  if (err.errors) {
    errObject.errors = err.errors;
  }
  return res.status(err.statusCode).json(errObject);
};
