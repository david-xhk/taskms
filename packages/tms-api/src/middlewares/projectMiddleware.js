import { parseArray, parseDate } from "@han-keong/tms-helpers/parseHelper"
import ProjectModel from "@han-keong/tms-models/ProjectModel"
import { validateGroupsExist } from "@han-keong/tms-models/validators/groupValidator"
import { validateGroups } from "@han-keong/tms-validators/groupValidator"
import { validateDate, validateDescription, validateProject } from "@han-keong/tms-validators/projectValidator"
import { nullable } from "@han-keong/tms-validators/validators"

import { ErrorMessage, ForbiddenError, ValidationError } from "./errorHandler.js"
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
      precondition: (body, req, res) => {
        if (req.user.username !== res.locals.project.createdBy) {
          return new ForbiddenError()
        }
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
          if (startDate > res.locals.project.endDate) {
            return ValidationError.fromErrors({ startDate: "startDate must be before current endDate" })
          }
        } else if (!startDate && endDate) {
          if (res.locals.project.startDate > endDate) {
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
