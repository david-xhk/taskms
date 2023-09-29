import { parseArray, parseDate, parseInteger } from "@han-keong/tms-helpers/parseHelper"
import { validateGroupsExist } from "@han-keong/tms-models/validators/groupValidator"
import { validateProjectNotExists } from "@han-keong/tms-models/validators/projectValidator"
import { validateGroups } from "@han-keong/tms-validators/groupValidator"
import { validateDate, validateDescription, validateProject, validateRunningNum } from "@han-keong/tms-validators/projectValidator"
import { nullable } from "@han-keong/tms-validators/validators"

import { ValidationError } from "./errorHandler.js"
import parseRequest from "./parseRequest.js"
import validateRequest from "./validateRequest.js"

export const createProjectMiddleware = [
  validateRequest(
    "body",
    {
      project: { required: true, validators: [validateProject, validateProjectNotExists] },
      runningNum: { required: true, validators: [validateRunningNum] },
      permitCreate: { required: true, validators: [validateGroups, validateGroupsExist] },
      permitOpen: { required: true, validators: [validateGroups, validateGroupsExist] },
      permitTodo: { required: true, validators: [validateGroups, validateGroupsExist] },
      permitDoing: { required: true, validators: [validateGroups, validateGroupsExist] },
      permitDone: { required: true, validators: [validateGroups, validateGroupsExist] },
      startDate: nullable(validateDate),
      endDate: nullable(validateDate),
      description: nullable(validateDescription)
    },
    {
      postcondition: body => {
        const startDate = body.startDate ? parseDate(body.startDate) : null
        const endDate = body.endDate ? parseDate(body.endDate) : null
        if (startDate && endDate && startDate > endDate) {
          return ValidationError.fromErrors({ startDate: "startDate must be before endDate" })
        }
      }
    }
  ),

  parseRequest("body", {
    runningNum: parseInteger,
    permitCreate: parseArray,
    permitOpen: parseArray,
    permitTodo: parseArray,
    permitDoing: parseArray,
    permitDone: parseArray,
    startDate: parseDate,
    endDate: parseDate
  })
]
