import { validateNoteContent } from "@han-keong/tms-validators/projectValidator"

import { ForbiddenError } from "./errorHandler.js"
import validateRequest from "./validateRequest.js"

export const createNoteMiddleware = [
  validateRequest(
    "body",
    { content: { required: true, validators: [validateNoteContent] } },
    {
      precondition: (body, req, res) => {
        if (!res.locals.project.isInPermitGroup(res.locals.task.state, req.user.groups)) {
          return new ForbiddenError()
        }
      }
    }
  )
]
