const logger = require("../config/logger");

const requestLogger = (req, res, next) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const durationInMs = process.hrtime(start);
    const duration = (durationInMs[0] * 1000 + durationInMs[1] / 1e6).toFixed(2);
    logger.info(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
      { method: req.method, url: req.originalUrl, status: res.statusCode }
    );
  });

  next();
};

const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400;
    message = "Invalid resource id";
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate value entered";
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  logger.error(`${req.method} ${req.originalUrl} -> ${message}`, {
    statusCode,
    stack: err.stack,
  });

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = { requestLogger, notFound, errorHandler };
