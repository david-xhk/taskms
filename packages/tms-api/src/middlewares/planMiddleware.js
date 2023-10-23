import { parseDate } from "@han-keong/tms-helpers/parseHelper"
import { nullable } from "@han-keong/tms-validators"

import { validateColour, validateDate, validatePlan } from "../validators/projectValidator.js"
import { ErrorMessage, ValidationError } from "./errorHandler.js"
import parseRequest from "./parseRequest.js"
import validateRequest, { validateParam } from "./validateRequest.js"

export async function plan(req, res, next) {
  const { plan } = req.params
  const { project } = res.locals
  try {
    res.locals.plan = await project.getPlanByName(plan)
    next()
  } catch (err) {
    next(err)
  }
}

export const updatePlanMiddleware = [
  validateRequest(
    "body",
    { colour: validateColour, startDate: nullable(validateDate), endDate: nullable(validateDate) },
    {
      precondition: body => {
        const { colour, startDate, endDate } = body
        if (colour === undefined && startDate === undefined && endDate === undefined) {
          return new ErrorMessage("Nothing to update.", 400)
        }
      },
      postcondition: (body, req, res) => {
        const startDate = body.startDate ? parseDate(body.startDate) : undefined
        const endDate = body.endDate ? parseDate(body.endDate) : undefined
        if (startDate && endDate) {
          if (startDate > endDate) {
            return ValidationError.fromErrors({ startDate: "startDate must be before endDate" })
          }
        } else if (startDate && !endDate) {
          if (res.locals.plan.endDate && startDate > res.locals.plan.endDate) {
            return ValidationError.fromErrors({ startDate: "startDate must be before current endDate" })
          }
        } else if (!startDate && endDate) {
          if (res.locals.plan.startDate && res.locals.plan.startDate > endDate) {
            return ValidationError.fromErrors({ endDate: "endDate must be after current startDate" })
          }
        }
      }
    }
  ),

  parseRequest("body", { startDate: parseDate, endDate: parseDate })
]

export const validatePlanParam = validateParam({
  validators: [validatePlan],
  postcondition: async (plan, req, res) => {
    if (await res.locals.project.planNotExists(plan)) {
      return ValidationError.fromErrors({ plan: "Plan not found" }, 404)
    }
  }
})
