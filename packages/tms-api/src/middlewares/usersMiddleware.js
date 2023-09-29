import bcrypt from "bcryptjs"

import { parseArray, parseBoolean } from "@han-keong/tms-helpers/parseHelper"
import { validateGroupsExist } from "@han-keong/tms-models/validators/groupValidator"
import { validateEmailNotExists, validateUsernameNotExists } from "@han-keong/tms-models/validators/userValidator"
import { validateGroups } from "@han-keong/tms-validators/groupValidator"
import { validateActive, validateEmail, validatePassword, validateUsername } from "@han-keong/tms-validators/userValidator"

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
