import { nullable } from "@han-keong/tms-validators"

import { validateDescription, validateNoteContent, validatePlan, validateTask } from "../validators/projectValidator.js"
import { ForbiddenError, ValidationError } from "./errorHandler.js"
import validateRequest from "./validateRequest.js"

export const createTaskMiddleware = [
  validateRequest(
    "body",
    {
      task: { required: true, validators: [validateTask] },
      description: { required: true, validators: [validateDescription] },
      plan: {
        validators: [nullable(validatePlan)],
        postcondition: async (plan, req, res) => {
          if (plan !== null) {
            if (await res.locals.project.planNotExists(plan)) {
              return ValidationError.fromErrors({ plan: "Plan not found" })
            }
          }
        }
      },
      note: nullable(validateNoteContent)
    },
    {
      precondition: (_, req, res) => {
        if (!res.locals.project.isInPermitCreate(req.user.groups)) {
          return new ForbiddenError()
        }
      }
    }
  )
]
