import bcrypt from "bcryptjs"

import { parseArray, parseBoolean } from "@han-keong/tms-helpers/parseHelper"

import { validateGroups, validateGroupsExist } from "../validators/groupValidator.js"
import { validateActive, validateEmail, validateEmailNotExists, validatePassword, validateUsername, validateUsernameNotExists } from "../validators/userValidator.js"

import parseRequest from "./parseRequest.js"
import validateRequest from "./validateRequest.js"

export const createUserMiddleware = [
  validateRequest("body", {
    username: { required: true, validators: [validateUsername, validateUsernameNotExists] },
    email: [validateEmail, validateEmailNotExists],
    password: { required: true, validators: [validatePassword] },
    active: { required: true, validators: [validateActive] },
    groups: [validateGroups, validateGroupsExist]
  }),

  parseRequest("body", {
    password: password => bcrypt.hash(password, 10),
    active: parseBoolean,
    groups: parseArray
  })
]
