import mongoose from "mongoose";
import express from "express";
const mongooseValidationError = mongoose.Error.ValidationError;
const isProduction = process.env.NODE_ENV === "production";
import { appResponse } from "src/helpers/app-response.helper";
import { AppError } from "src/helpers/app-error.helper";

const errorNames = [
  "CastError",
  "JsonWebTokenError",
  "ValidationError",
  "SyntaxError",
  "MongooseError",
  "MongoError",
];

const ErrorMiddleware = function (
  error: AppError,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (error.name === "AppError" || error.isOperational) {
    return appResponse(res, error.statusCode, error.message, null);
  }

  if (error instanceof mongooseValidationError) {
    const errorMessages = Object.values(error.errors).map((e) => e.message);
    return appResponse(
      res,
      400,
      "Validation error occurred check your inputs for corrections",
      errorMessages
    );
  }

  if (error.hasOwnProperty("name") && error.name === "MongoError") {
    return appResponse(res, 400, "The entry already exist");
  }

  if (errorNames.includes(error.name)) {
    return appResponse(res, 400, error.message);
  }

  const message = isProduction
    ? "An unknown error has occured. Please, contact the administrator"
    : error.message;

  return appResponse(res, 500, message);
};

export { ErrorMiddleware };
