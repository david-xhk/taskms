import { validateGroup, validateGroupNotExists } from "../validators/groupValidator.js"
import validateRequest from "./validateRequest.js"

export const createGroupMiddleware = [
  validateRequest("body", {
    group: { required: true, validators: [validateGroup, validateGroupNotExists] }
  })
]
