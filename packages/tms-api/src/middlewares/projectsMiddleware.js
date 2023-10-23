import { parseArray, parseDate, parseInteger } from "@han-keong/tms-helpers/parseHelper"
import { nullable } from "@han-keong/tms-validators"

import { validateGroups, validateGroupsExist } from "../validators/groupValidator.js"
import { validateDate, validateDescription, validateProject, validateProjectNotExists, validateRunningNum } from "../validators/projectValidator.js"
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
