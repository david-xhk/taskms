import { checkGroupNotExists, checkUserGroupExists, checkUserGroupNotExists, checkUserGroupsExist, checkUserGroupsNotExist, checkUsernameExists, checkUsernamesExist, validateGroup, validateUsername, validateUsernames } from "@han-keong/tms-validators"
import { hasError, hasErrors } from "@han-keong/validators"

import { ErrorMessage, ValidationError } from "./errorHandler.js"

export async function validateGroupParam(req, res, next, group) {
  const result = {}
  validateGroup(group, result)
  if (hasErrors(result)) {
    return next(new ValidationError(result))
  }
  if (await checkGroupNotExists(group).catch(next)) {
    return next(new ErrorMessage("Group not found.", 404))
  }
  next()
}

export async function validateAddUsersToGroupBody(req, res, next) {
  const { group } = req.params
  let { username, usernames } = req.body
  const result = {}
  if (usernames !== undefined) {
    validateUsernames(usernames, result)
    if (!hasError(result, "usernames")) {
      await checkUsernamesExist(usernames, result).catch(next)
      if (!hasError(result, "usernames")) {
        const userGroups = usernames.map(username => [username, group])
        await checkUserGroupsNotExist(userGroups, result).catch(next)
      }
    }
  }
  // If usernames provided, no need to validate username if not provided
  if (!(usernames !== undefined && username === undefined)) {
    validateUsername(username, result)
    if (!hasError(result, "username")) {
      await checkUsernameExists(username, result).catch(next)
      if (!hasError(result, "username")) {
        await checkUserGroupNotExists([username, group], result).catch(next)
      }
    }
  }
  if (hasErrors(result)) {
    return next(new ValidationError(result))
  }
  next()
}

export async function validateRemoveUsersFromGroupBody(req, res, next) {
  const { group } = req.params
  let { username, usernames } = req.body
  const result = {}
  if (usernames !== undefined) {
    validateUsernames(usernames, result)
    if (!hasError(result, "usernames")) {
      await checkUsernamesExist(usernames, result).catch(next)
      if (!hasError(result, "usernames")) {
        const userGroups = usernames.map(username => [username, group])
        await checkUserGroupsExist(userGroups, result).catch(next)
      }
    }
  }
  // If usernames provided, no need to validate username if not provided
  if (!(usernames !== undefined && username === undefined)) {
    validateUsername(username, result)
    if (!hasError(result, "username")) {
      await checkUsernameExists(username, result).catch(next)
      if (!hasError(result, "username")) {
        await checkUserGroupExists([username, group], result).catch(next)
      }
    }
  }
  if (hasErrors(result)) {
    return next(new ValidationError(result))
  }
  next()
}
