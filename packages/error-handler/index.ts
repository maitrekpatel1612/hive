export class AppError extends Error {
  // Public readonly for the properties so that they can be accessed but not modified
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this);
  }
}

//~ Not found Error
export class NotFoundError extends AppError {
  constructor(message = "Resources not Found") {
    super(message, 404);
  }
}

//~ Validation Error (Use for Joi/Zod/React-Hooks-Form)
export class ValidationError extends AppError {
  constructor(message = "Validation Error", details?: any) {
    super(message, 400, true, details);
  }
}

//~ Authentication Error
export class AuthError extends AppError {
  constructor(message = "UnAuthorized") {
    super(message, 401);
  }
}

//~ Forbidden Error (For Insufficient Permissions)
export class ForbiddenError extends AppError {
  constructor(message = "Forbidden Access") {
    super(message, 403);
  }
}

//~ Database Error
export class DatabaseError extends AppError {
  constructor(message = "Database Error", details?: any) {
    super(message, 500, true, details);
  }
}

//~ Rate Limiting Error
export class RateLimitError extends AppError {
  constructor(message = "Too Many Requests,Please Try Again") {
    super(message, 429);
  }
}