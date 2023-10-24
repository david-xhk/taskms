import bcrypt from "bcryptjs"

import { parseArray, parseBoolean } from "@han-keong/tms-helpers/parseHelper"

import UserModel from "../models/UserModel.js"
import { validateGroups, validateGroupsExist } from "../validators/groupValidator.js"
import { validateActive, validateEmail, validateEmailNotExists, validatePassword, validateUsername } from "../validators/userValidator.js"

import { ErrorMessage, ValidationError } from "./errorHandler.js"
import parseRequest from "./parseRequest.js"
import validateRequest, { currentUserIsAdmin, validateParam } from "./validateRequest.js"

export async function user(req, res, next) {
  const { username } = req.params
  if (username === undefined || username === req.user.username) {
    res.locals.user = req.user
  } else {
    try {
      res.locals.user = await UserModel.findByUsername(username)
    } catch (err) {
      return next(err)
    }
  }
  next()
}

export const updateUserMiddleware = [
  validateRequest(
    "body",
    {
      email: {
        shouldValidate: (email, req, res) => email !== null && email !== res.locals.user.email,
        validators: [validateEmail, validateEmailNotExists]
      },
      password: validatePassword,
      active: { validators: [validateActive], precondition: currentUserIsAdmin },
      groups: { validators: [validateGroups, validateGroupsExist], precondition: currentUserIsAdmin }
    },
    {
      precondition: body => {
        const { email, password, active, groups } = body
        if (email === undefined && password === undefined && active === undefined && groups === undefined) {
          return new ErrorMessage("Nothing to update.", 400)
        }
      }
    }
  ),

  parseRequest("body", {
    password: password => bcrypt.hash(password, 10),
    active: parseBoolean,
    groups: parseArray
  })
]

export const validateUsernameParam = validateParam({
  shouldValidate: (username, req) => username !== req.user.username,
  validators: [validateUsername],
  precondition: currentUserIsAdmin,
  postcondition: async username => {
    if (await UserModel.usernameNotExists(username)) {
      return ValidationError.fromErrors({ username: "User not found." }, 404)
    }
  }
})
