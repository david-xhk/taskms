import { join, sentencify } from "@han-keong/tms-helpers/stringHelper"
import { getErrors, setErrors } from "@han-keong/tms-validators/validators"

export class ErrorMessage extends Error {
  constructor(message, statusCode) {
    super(sentencify(message))
    this.statusCode = statusCode
  }
}

export class ForbiddenError extends ErrorMessage {
  constructor() {
    super("You are not allowed to access this resource.", 403)
  }
}

export class ValidationError extends Error {
  constructor(result, statusCode = 400) {
    const errors = getErrors(result)
    const error = join(Object.values(errors), " ")
    super(sentencify(error))
    this.errors = errors
    this.statusCode = statusCode
  }

  static fromErrors(errors, statusCode = 400) {
    let result = {}
    setErrors(result, errors)
    return new ValidationError(result, statusCode)
  }
}

export default function errorHandler(err, req, res, next) {
  err.statusCode = err.statusCode || 500
  if (process.env.NODE_ENV === "production") {
    let error = err
    if (error.name === "JsonWebTokenError") {
      error = new ErrorMessage("JSON Web Token is invalid.", 500)
    }
    if (error.name === "TokenExpiredError") {
      error = new ErrorMessage("JSON Web Token is expired.", 500)
    }
    res.status(error.statusCode).json({
      success: false,
      message: error.message || "Internal Server Error.",
      errors: error.errors
    })
  } else if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      stack: err.stack
    })
  } else {
    next(err)
  }
}
