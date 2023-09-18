import { validateGroup, validateGroups, validateGroupsString } from "tms-all/validators/groupValidator.js"
import { validateActive, validateEmail, validatePassword, validateUsername } from "tms-all/validators/userValidator.js"
import { getError, hasError, hasErrors } from "tms-all/validators/validators.js"

import User from "../models/User.js"
import UserGroup from "../models/UserGroup.js"
import { checkGroupExists, checkGroupsExist } from "../validators/groupValidator.js"
import { checkEmailNotExists, checkUsernameNotExists } from "../validators/userValidator.js"
import { ErrorMessage, ValidationError } from "./errorHandler.js"

export async function validateUsernameParam(req, res, next, username) {
  const result = {}
  validateUsername(username, result)
  if (hasErrors(result)) {
    return next(new ValidationError(result))
  }
  if (req.user.username !== username) {
    if (await UserGroup.userGroupNotExists([req.user.username, "admin"])) {
      return next(new ErrorMessage("You are not allowed to access this resource.", 403))
    }
    if (await checkUsernameNotExists(username).catch(next)) {
      return next(new ErrorMessage("User not found.", 404))
    }
  }
  next()
}

export async function fetchRequestedUser(req, res, next) {
  const { username } = req.params
  if (username === req.user.username) {
    req.params.user = req.user
  } else {
    req.params.user = await User.findByUsername(username).catch(next)
  }
  next()
}

export async function validateCheckUserGroupsQuery(req, res, next) {
  let { group, groups } = req.query
  const result = {}
  if (groups !== undefined) {
    validateGroupsString(groups, result)
    if (!hasError(result, "groups")) {
      await checkGroupsExist(groups, result).catch(next)
    }
  }
  // If groups provided, no need to validate group if not provided
  if (!(groups !== undefined && group === undefined)) {
    validateGroup(group, result)
    if (!hasError(result, "group")) {
      await checkGroupExists(group, result).catch(next)
    }
  }
  if (hasErrors(result)) {
    return next(new ValidationError(result))
  }
  next()
}

export async function validateUpdateUserBody(req, res, next) {
  let { email, password, active, groups } = req.body
  if (email === undefined && password === undefined && active === undefined && groups === undefined) {
    return next(new ErrorMessage("Nothing to update.", 400))
  }
  const result = {}
  if (email !== undefined && email !== req.params.user.email) {
    validateEmail(email, result)
    if (!hasError(result, "email")) {
      await checkEmailNotExists(email, result).catch(next)
    }
  }
  if (password !== undefined) {
    validatePassword(password, result)
  }
  if (active !== undefined) {
    if (!req.user.isInGroup("admin")) {
      return next(new ErrorMessage("You are not allowed to change active status. Please contact an administrator to do so.", 403))
    }
    validateActive(active, result)
  }
  if (groups !== undefined) {
    if (!req.user.isInGroup("admin")) {
      return next(new ErrorMessage("You are not allowed to change groups. Please contact an administrator to do so.", 403))
    }
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
