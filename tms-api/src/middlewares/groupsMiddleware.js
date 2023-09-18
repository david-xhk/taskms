import { validateGroup, validateGroups } from "tms-all/validators/groupValidator.js"
import { hasError, hasErrors } from "tms-all/validators/validators.js"

import { checkGroupNotExists, checkGroupsNotExist } from "../validators/groupValidator.js"
import { ValidationError } from "./errorHandler.js"

export async function validateCreateGroupsBody(req, res, next) {
  let { group, groups } = req.body
  const result = {}
  if (groups !== undefined) {
    validateGroups(groups, result)
    if (!hasError(result, "groups")) {
      await checkGroupsNotExist(groups, result).catch(next)
    }
  }
  // If groups provided, no need to validate group if not provided
  if (!(groups !== undefined && group === undefined)) {
    validateGroup(group, result)
    if (!hasError(result, "group")) {
      await checkGroupNotExists(group, result).catch(next)
    }
  }
  if (hasErrors(result)) {
    return next(new ValidationError(result))
  }
  next()
}
