import { Router } from "express"

import { createGroups, getAllGroups } from "../controllers/groupsController.js"
import { authentication, authorization } from "../middlewares/authMiddleware.js"
import { validateCreateGroupsBody } from "../middlewares/groupsMiddleware.js"
import parse from "../middlewares/parseMiddleware.js"

const router = Router()

// Ensure user logged in
router.use(authentication)

router
  // Endpoint: /api/groups
  .route("/")

  // Target: GET /api/groups
  .get(
    // Call controller
    getAllGroups
  )

  // Target: POST /api/groups
  .post(
    // Ensure user is admin
    authorization("admin"),
    // Validate body data
    validateCreateGroupsBody,
    // Parse body data
    parse("body", "group-or-groups"),
    // Call controller
    createGroups
  )

export default router
