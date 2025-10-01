module.exports = (err, req, res, next) => {
  if (!err.isOperationalError) console.log(err);
  err.statusCode = err.statusCode || 500;
  const errObject = {
    status: err.statusCode.toString().startsWith("4") ? "fail" : "error",
    message: err.message || "internal server error",
  };
  if (err.errors) {
    errObject.errors = err.errors;
  }
  return res.status(err.statusCode).json(errObject);
};
