class AppError extends Error {
    statusCode: number;
    message: string;
    isOperational: boolean;
    date: Date;
    constructor(message: string, statusCode: number = 500) {
      super(message);
      this.message = message;
      this.name = "AppError";
      this.statusCode = statusCode;
      this.isOperational = true;
      this.date = new Date();
  
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
  
  class BadRequestError extends AppError {
    constructor(message = "Bad Request", statusCode = 400) {
      super(message, statusCode);
    }
  }
  
  class InternalServerError extends AppError {
    constructor(message = "Internal Server Error.", statusCode = 500) {
      super(message, statusCode);
    }
  }
  
  class UnAuthorizedError extends AppError {
    constructor(message = "Unauthorized access", statusCode = 401) {
      super(message, statusCode);
    }
  }
  
  class ForbiddenError extends AppError {
    constructor(message = "Forbidden", statusCode = 403) {
      super(message, statusCode);
    }
  }
  class ExpectationFailedError extends AppError {
    constructor(message = "Expected inputs were not supplied", statusCode = 417) {
      super(message, statusCode);
    }
  }
  
  class NotFoundError extends AppError {
    constructor(message = "Resource not found", statusCode = 404) {
      super(message, statusCode);
    }
  }
  class InvalidError extends AppError {
    constructor(message = "Invalid Input", statusCode = 422) {
      super(message, statusCode);
    }
  }
  class DuplicateError extends AppError {
    constructor(message = "Duplicate value", statusCode = 406) {
      super(message, statusCode);
    }
  }
  
  export {
    BadRequestError,
    InternalServerError,
    UnAuthorizedError,
    ForbiddenError,
    ExpectationFailedError,
    NotFoundError,
    InvalidError,
    DuplicateError,
    AppError,
  };
  