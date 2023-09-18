import { Router } from "express"

import { createUser, getAllUsers } from "../controllers/usersController.js"
import { authentication, authorization } from "../middlewares/authMiddleware.js"
import parse from "../middlewares/parseMiddleware.js"
import { validateCreateUserBody, validateGetAllUsersQuery } from "../middlewares/usersMiddleware.js"

const router = Router()

// Ensure user logged in and is admin
router.use(authentication, authorization("admin"))

router
  // Endpoint: /api/users
  .route("/")

  // Target: GET /api/users
  .get(
    // Validate query parameters
    validateGetAllUsersQuery,
    // Parse query parameters
    parse("query", "active", "groups", "limit", "page", "offset"),
    // Call controller
    getAllUsers
  )

  // Target: POST /api/users
  .post(
    // Validate body data
    validateCreateUserBody,
    // Parse body data
    parse("body", "password", "active", "group-or-groups"),
    // Call controller
    createUser
  )

export default router
