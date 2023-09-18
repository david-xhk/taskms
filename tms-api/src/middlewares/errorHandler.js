import { join } from "tms-all/helpers/arrayHelper.js"
import { sentencify } from "tms-all/helpers/stringHelper.js"
import { getErrors } from "tms-all/validators/validators.js"

export class ErrorMessage extends Error {
  constructor(message, statusCode) {
    super(sentencify(message))
    this.statusCode = statusCode
  }
}

export class ValidationError extends Error {
  constructor(result) {
    const errors = getErrors(result)
    const error = join(Object.values(errors), " ")
    super(sentencify(error))
    this.errors = errors
    this.statusCode = 400
  }
}

export default function errorHandler(err, req, res, next) {
  err.statusCode = err.statusCode || 500
  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      stack: err.stack
    })
  }
  if (process.env.NODE_ENV === "production") {
    let error = err
    if (error.name === "JsonWebTokenError") {
      const message = "JSON Web Token is invalid. Please try again!"
      error = new ErrorMessage(message, 500)
    }
    if (error.name === "TokenExpiredError") {
      const message = "JSON Web Token has expired. Please try again!"
      error = new ErrorMessage(message, 500)
    }
    res.status(error.statusCode).json({
      success: false,
      message: error.message || "Internal Server Error.",
      errors: error.errors
    })
  }
  next()
}
