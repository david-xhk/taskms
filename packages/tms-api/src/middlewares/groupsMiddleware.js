import { validateGroupNotExists } from "@han-keong/tms-models/validators/groupValidator"
import { validateGroup } from "@han-keong/tms-validators/groupValidator"

import validateRequest from "./validateRequest.js"

export const createGroupMiddleware = [
  validateRequest("body", {
    group: { required: true, validators: [validateGroup, validateGroupNotExists] }
  })
]
