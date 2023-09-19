import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import { User } from "@han-keong/tms-db"
import { checkEmailNotExists, checkUsernameNotExists, validateEmail, validatePassword, validateUsername } from "@han-keong/tms-validators"
import { hasError, hasErrors } from "@han-keong/validators"

import { ErrorMessage, ValidationError } from "./errorHandler.js"

export async function authentication(req, res, next) {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]
    if (token === "null") {
      token = undefined
    }
  }
  if (req.cookies && "token" in req.cookies) {
    token = req.cookies.token
  }
  if (!token) {
    return next(new ErrorMessage("You must be logged in to access this resource.", 401))
  }
  const { username } = jwt.verify(token, process.env.JWT_SECRET)
  const user = await User.findByUsername(username).catch(next)
  if (!user) {
    return next(new ErrorMessage("You are not allowed to access this resource.", 403))
  }
  if (!user.active) {
    return next(new ErrorMessage("Your account has been disabled. Please contact the administrator to access the system.", 403))
  }
  req.user = user
  next()
}

export function authorization(...groups) {
  function authorized(req, res, next) {
    if (!req.user.isInGroups(groups)) {
      return next(new ErrorMessage("You are not allowed to access this resource.", 403))
    }
    next()
  }
  return authorized
}

export async function validateRegisterUserBody(req, res, next) {
  let { username, email, password } = req.body
  const result = {}
  validateUsername(username, result)
  if (!hasError(result, "username")) {
    await checkUsernameNotExists(username, result).catch(next)
  }
  if (email !== undefined) {
    validateEmail(email, result)
    if (!hasError(result, "email")) {
      await checkEmailNotExists(email, result).catch(next)
    }
  }
  validatePassword(password, result)
  if (hasErrors(result)) {
    next(new ValidationError(result))
  }
  next()
}

export async function authenticateLoginUserBody(req, res, next) {
  const { username, password } = req.body
  let authenticated = validateUsername(username) && validatePassword(password)
  const hash = await User.selectPasswordByUsername(username).catch(() => null)
  authenticated &&= await bcrypt.compare(password, hash).catch(() => null)
  if (!authenticated) {
    return next(new ErrorMessage("Invalid username or password", 401))
  }
  const user = await User.findByUsername(username).catch(next)
  if (!user.active) {
    return next(new ErrorMessage("Your account has been disabled. Please contact the administrator to access the system.", 403))
  }
  req.user = user
  next()
}
