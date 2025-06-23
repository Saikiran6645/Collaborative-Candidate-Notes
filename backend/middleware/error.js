// middleware/error.js
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal server error.";
  err.statusCode = err.statusCode || 500;

  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler("Json web token is invalid, Try again.", 400);
  }

  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler("Json web token is expired, Try again.", 400);
  }

  if (err.name === "CastError") {
    err = new ErrorHandler(`Invalid ${err.path}`, 400);
  }

  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(" ")
    : err.message;

  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

module.exports = {
  errorMiddleware,
  ErrorHandler,
};
