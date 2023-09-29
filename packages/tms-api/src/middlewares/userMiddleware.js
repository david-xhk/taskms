import bcrypt from "bcryptjs"

import { parseArray, parseBoolean } from "@han-keong/tms-helpers/parseHelper"
import UserModel from "@han-keong/tms-models/UserModel"
import { validateGroupsExist } from "@han-keong/tms-models/validators/groupValidator"
import { validateEmailNotExists } from "@han-keong/tms-models/validators/userValidator"
import { validateGroups } from "@han-keong/tms-validators/groupValidator"
import { validateActive, validateEmail, validatePassword, validateUsername } from "@han-keong/tms-validators/userValidator"

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
        shouldValidate: (email, req, res) => email !== res.locals.user.email,
        validators: [validateEmail, validateEmailNotExists]
      },
      password: validatePassword,
      active: { precondition: currentUserIsAdmin, validators: [validateActive] },
      groups: { precondition: currentUserIsAdmin, validators: [validateGroups, validateGroupsExist] }
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
  precondition: currentUserIsAdmin,
  shouldValidate: (username, req) => username !== req.user.username,
  validators: [validateUsername],
  postcondition: async username => {
    if (await UserModel.usernameNotExists(username)) {
      return ValidationError.fromErrors({ username: "User not found." }, 404)
    }
  }
})
