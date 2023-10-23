import { nullable } from "@han-keong/tms-validators"

import { validatePlan, validateTaskNum, validateTaskState } from "../validators/projectValidator.js"
import { ErrorMessage, ForbiddenError, ValidationError } from "./errorHandler.js"
import validateRequest, { validateParam } from "./validateRequest.js"

export async function task(req, res, next) {
  const { taskNum } = req.params
  const { project } = res.locals
  try {
    res.locals.task = await project.getTaskByNum(taskNum)
    next()
  } catch (err) {
    next(err)
  }
}

export const updateTaskMiddleware = [
  validateRequest(
    "body",
    {
      state: {
        validators: [validateTaskState],
        postcondition: (state, req, res) => {
          if (!res.locals.task.isValidTransition(state)) {
            return ValidationError.fromErrors({ state: "State transition not allowed." }, 403)
          }
        }
      },
      plan: {
        validators: [nullable(validatePlan)],
        precondition: (_, __, res) => {
          if (!["open", "done"].includes(res.locals.task.state)) {
            return ValidationError.fromErrors({ plan: "Plan update not allowed." }, 403)
          }
        },
        postcondition: async (plan, req, res) => {
          if (plan !== null) {
            if (await res.locals.project.planNotExists(plan)) {
              return ValidationError.fromErrors({ plan: "Plan not found" })
            }
          }
        }
      }
    },
    {
      precondition: (body, req, res) => {
        if (!res.locals.project.isInPermitGroup(res.locals.task.state, req.user.groups)) {
          return new ForbiddenError()
        }
        const { state, plan } = body
        if (state === undefined && plan === undefined) {
          return new ErrorMessage("Nothing to update.", 400)
        }
      }
    }
  )
]

export const validateTaskNumParam = validateParam({
  validators: [validateTaskNum],
  postcondition: async (taskNum, req, res) => {
    if (await res.locals.project.taskNumNotExists(taskNum)) {
      return ValidationError.fromErrors({ taskNum: "Task not found." }, 404)
    }
  }
})
