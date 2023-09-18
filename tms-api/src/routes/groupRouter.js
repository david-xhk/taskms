import { Router } from "express"

import { addUsersToGroup, getUsersInGroup, removeUsersFromGroup } from "../controllers/groupController.js"
import { authorization, authentication } from "../middlewares/authMiddleware.js"
import { validateAddUsersToGroupBody, validateGroupParam, validateRemoveUsersFromGroupBody } from "../middlewares/groupMiddleware.js"
import parse from "../middlewares/parseMiddleware.js"

const router = Router()

// Ensure user logged in and is admin
router.use(authentication, authorization("admin"))

// Validate group URL parameter
router.param("group", validateGroupParam)

router
  // Endpoint: /api/group/:group/users
  .route("/:group/users")

  // Target: GET /api/group/:group/users
  .get(
    // Call controller
    getUsersInGroup
  )

  // Target: POST /api/group/:group/users
  .post(
    // Validate body data
    validateAddUsersToGroupBody,
    // Parse body data
    parse("body", "username-or-usernames"),
    // Call controller
    addUsersToGroup
  )

  // Target: DELETE /api/group/:group/users
  .delete(
    // Validate body data
    validateRemoveUsersFromGroupBody,
    // Parse body data
    parse("body", "username-or-usernames"),
    // Call controller
    removeUsersFromGroup
  )

export default router
