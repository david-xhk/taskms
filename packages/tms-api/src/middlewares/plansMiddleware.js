import { parseDate } from "@han-keong/tms-helpers/parseHelper"
import { nullable } from "@han-keong/tms-validators"

import { validateColour, validateDate, validatePlan } from "../validators/projectValidator.js"

import { ValidationError } from "./errorHandler.js"
import parseRequest from "./parseRequest.js"
import validateRequest from "./validateRequest.js"

export const createPlanMiddleware = [
  validateRequest(
    "body",
    {
      plan: {
        required: true,
        validators: [validatePlan],
        postcondition: async (plan, req, res) => {
          if (await res.locals.project.planExists(plan)) {
            return ValidationError.fromErrors({ plan: "Plan already exists" })
          }
        }
      },
      colour: { required: true, validators: [validateColour] },
      startDate: nullable(validateDate),
      endDate: nullable(validateDate)
    },
    {
      postcondition: body => {
        const startDate = parseDate(body.startDate)
        const endDate = parseDate(body.endDate)
        if (startDate > endDate) {
          return ValidationError.fromErrors({ startDate: "startDate must be before endDate" })
        }
      }
    }
  ),

  parseRequest("body", { startDate: parseDate, endDate: parseDate })
]
