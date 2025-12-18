
export const errorHandler = (statusCode = 500, message = "Internal Server Error") => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

export const handleErrorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
};
