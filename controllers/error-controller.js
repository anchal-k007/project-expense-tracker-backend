module.exports = (err, req, res, next) => {
  if(!err.isOperationalError)
    console.log(err);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "internal server error";
  err.status = err.statusCode.toString().startsWith("4") ? "fail" : "error";
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
}