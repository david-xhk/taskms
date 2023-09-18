import { Router } from "express"

import { checkUserGroups, getCurrentUser, getUser, getUserGroups, updateUser } from "../controllers/userController.js"
import { authentication } from "../middlewares/authMiddleware.js"
import parse from "../middlewares/parseMiddleware.js"
import { fetchRequestedUser, validateCheckUserGroupsQuery, validateUpdateUserBody, validateUsernameParam } from "../middlewares/userMiddleware.js"

const router = Router()

// Ensure user logged in
router.use(authentication)

router
  // Endpoint: /api/user
  .route("/")

  // Target: GET /api/user
  .get(
    // Call controller
    getCurrentUser
  )

// Validate username URL parameter
router.param("username", validateUsernameParam)

router
  // Endpoint: /api/user/:username.groups
  .route("/:username.groups")

  // Target: GET /api/user/:username.groups
  .get(
    // Call controller
    getUserGroups
  )

router
  // Endpoint: /api/user/:username.checkGroup
  .route("/:username.checkGroup")

  // Target: GET /api/user/:username.checkGroup
  .get(
    // Validate query parameters
    validateCheckUserGroupsQuery,
    // Parse query parameters
    parse("query", "group-or-groups"),
    // Call controller
    checkUserGroups
  )

router
  // Endpoint: /api/user/:username
  .route("/:username")

  // Target: GET /api/user/:username
  .get(
    // Fetch user from database
    fetchRequestedUser,
    // Call controller
    getUser
  )

  // Target: PUT /api/user/:username
  .put(
    // Fetch user from database
    fetchRequestedUser,
    // Validate body data
    validateUpdateUserBody,
    // Parse body data
    parse("body", "password", "active", "groups"),
    // Call controller
    updateUser
  )

export default router
