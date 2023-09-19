import { setValue } from "@han-keong/helpers"
import { checkEmailNotExists, checkGroupExists, checkGroupsExist, checkUsernameNotExists, validateActive, validateActiveString, validateEmail, validateGroup, validateGroups, validateGroupsString, validateLimit, validateOffset, validatePage, validatePassword, validateUsername } from "@han-keong/tms-validators"
import { hasError, hasErrors } from "@han-keong/validators"

import { ValidationError } from "./errorHandler.js"

export async function validateGetAllUsersQuery(req, res, next) {
  let { q, active, group, groups, limit, page, offset } = req.query
  const result = {}
  if (q !== undefined) {
    validateUsername(q, result, "q", { prefix: "username search query" })
  }
  if (active !== undefined) {
    validateActiveString(active, result)
  }
  if (group !== undefined) {
    validateGroup(group, result)
    if (!hasError(result, "group")) {
      await checkGroupExists(group, result).catch(next)
    }
  }
  if (groups !== undefined) {
    validateGroupsString(groups, result)
    if (!hasError(result, "groups")) {
      await checkGroupsExist(groups, result).catch(next)
    }
  }
  if (limit !== undefined) {
    validateLimit(limit, result)
  }
  if (page !== undefined) {
    if (limit === undefined) {
      setValue(result, "errors.page", "Page must be specified together with a limit.")
    } else {
      validatePage(page, result)
    }
  }
  if (offset !== undefined) {
    if (limit === undefined) {
      setValue(result, "errors.offset", "Offset must be specified together with a limit.")
    } else {
      validateOffset(offset, result)
    }
  }
  if (hasErrors(result)) {
    return next(new ValidationError(result))
  }
  next()
}

export async function validateCreateUserBody(req, res, next) {
  let { username, email, password, active, group, groups } = req.body
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
  validateActive(active)
  if (group !== undefined) {
    validateGroup(group, result)
    if (!hasError(result, "group")) {
      await checkGroupExists(group, result).catch(next)
    }
  }
  if (groups !== undefined) {
    validateGroups(groups, result)
    if (!hasError(result, "groups")) {
      await checkGroupsExist(groups, result).catch(next)
    }
  }
  if (hasErrors(result)) {
    return next(new ValidationError(result))
  }
  next()
}
