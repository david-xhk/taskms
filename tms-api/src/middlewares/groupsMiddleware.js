import { checkGroupNotExists, checkGroupsNotExist, validateGroup, validateGroups } from "@han-keong/tms-validators"
import { hasError, hasErrors } from "@han-keong/validators"

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
