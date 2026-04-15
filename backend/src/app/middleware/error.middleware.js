import ApiError from "../../utils/api-error.js";
import { ZodError } from "zod";

// Handle PostgreSQL errors
function handleDatabaseError(err) {
  // Unique constraint violation (code 23505)
  if (err.code === '23505') {
    if (err.constraint === 'users_user_name_key') {
      return new ApiError(400, "Username already exists");
    }
    if (err.constraint === 'users_email_key') {
      return new ApiError(400, "Email already exists");
    }
    return new ApiError(400, "This information already exists");
  }
  return null;
}

export function globalErrorHandler(err, req, res, next) {
  let customError;

  if (err instanceof ApiError) {
    customError = err;
  } else if (err.code && err.code.startsWith('23')) {
    // PostgreSQL error - handle database constraint violations
    customError = handleDatabaseError(err);
    if (!customError) {
      customError = new ApiError(500, "Internal Server Error");
    }
  } else if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      issues: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  } else {
    const statusCode =
      err instanceof Error && "statusCode" in err ? err.statusCode : 500;

    const message =
      err instanceof Error ? err.message : "Internal Server Error";

    customError = new ApiError(statusCode, message);
  }

  return res.status(customError.statusCode).json({
    success: false,
    message: customError.message,
    statusCode: customError.statusCode,
    ...(process.env.NODE_ENV === "development" && {
      stack: err instanceof Error ? err.stack : undefined,
    }),
  });
}
