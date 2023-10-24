import { parseArray, parseDate } from "@han-keong/tms-helpers/parseHelper"
import { nullable } from "@han-keong/tms-validators"

import ProjectModel from "../models/ProjectModel.js"
import { validateGroups, validateGroupsExist } from "../validators/groupValidator.js"
import { validateDate, validateDescription, validateProject } from "../validators/projectValidator.js"

import { ErrorMessage, ValidationError } from "./errorHandler.js"
import parseRequest from "./parseRequest.js"
import validateRequest, { validateParam } from "./validateRequest.js"

export async function project(req, res, next) {
  const { project } = req.params
  try {
    res.locals.project = await ProjectModel.findByProjectName(project)
    next()
  } catch (err) {
    next(err)
  }
}

export const updateProjectMiddleware = [
  validateRequest(
    "body",
    {
      permitCreate: [validateGroups, validateGroupsExist],
      permitOpen: [validateGroups, validateGroupsExist],
      permitTodo: [validateGroups, validateGroupsExist],
      permitDoing: [validateGroups, validateGroupsExist],
      permitDone: [validateGroups, validateGroupsExist],
      startDate: nullable(validateDate),
      endDate: nullable(validateDate),
      description: nullable(validateDescription)
    },
    {
      precondition: body => {
        const { permitCreate, permitOpen, permitTodo, permitDoing, permitDone, startDate, endDate, description } = body
        if (permitCreate === undefined && permitOpen === undefined && permitTodo === undefined && permitDoing === undefined && permitDone === undefined && startDate === undefined && endDate === undefined && description === undefined) {
          return new ErrorMessage("Nothing to update.", 400)
        }
      },
      postcondition: (body, req, res) => {
        const startDate = body.startDate ? parseDate(body.startDate) : null
        const endDate = body.endDate ? parseDate(body.endDate) : null
        if (startDate && endDate) {
          if (startDate > endDate) {
            return ValidationError.fromErrors({ startDate: "startDate must be before endDate" })
          }
        } else if (startDate && !endDate) {
          if (res.locals.project.endDate && startDate > res.locals.project.endDate) {
            return ValidationError.fromErrors({ startDate: "startDate must be before current endDate" })
          }
        } else if (!startDate && endDate) {
          if (res.locals.project.startDate && res.locals.project.startDate > endDate) {
            return ValidationError.fromErrors({ endDate: "endDate must be after current startDate" })
          }
        }
      }
    }
  ),

  parseRequest("body", {
    permitCreate: parseArray,
    permitOpen: parseArray,
    permitTodo: parseArray,
    permitDoing: parseArray,
    permitDone: parseArray,
    startDate: parseDate,
    endDate: parseDate
  })
]

export const validateProjectParam = validateParam({
  validators: [validateProject],
  postcondition: async project => {
    if (await ProjectModel.projectNotExists(project)) {
      return ValidationError.fromErrors({ project: "Project not found" }, 404)
    }
  }
})
