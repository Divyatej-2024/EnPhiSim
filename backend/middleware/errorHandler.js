import logger from "../utils/logger.js";

export function notFoundHandler(req, res) {
  logger.warn("Endpoint not found", { method: req.method, url: req.originalUrl });
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "Endpoint not found",
    },
  });
}

export function csrfErrorHandler(err, req, res, next) {
  if (err?.code !== "EBADCSRFTOKEN") {
    return next(err);
  }

  logger.warn("Invalid CSRF token", { method: req.method, url: req.originalUrl });
  return res.status(403).json({
    success: false,
    error: {
      code: "INVALID_CSRF_TOKEN",
      message: "Invalid CSRF token",
    },
  });
}

export function generalErrorHandler(err, req, res, _next) {
  logger.error("Unhandled error", {
    method: req.method,
    url: req.originalUrl,
    message: err?.message || "Unknown error",
  });

  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message:
        process.env.NODE_ENV === "production"
          ? "An internal server error occurred"
          : err?.message || "Internal server error",
    },
  });
}
