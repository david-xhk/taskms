import { Router } from "express"

import { loginUser, logoutUser, registerUser } from "../controllers/authController.js"
import { authenticateLoginUserBody, validateRegisterUserBody } from "../middlewares/authMiddleware.js"
import parse from "../middlewares/parseMiddleware.js"

const router = Router()

router
  // Endpoint: /api/auth/register
  .route("/register")

  // Target: POST /api/auth/register
  .post(
    // Validate body data
    validateRegisterUserBody,
    // Parse body data
    parse("body", "password"),
    // Call controller
    registerUser
  )

router
  // Endpoint: /api/auth/login
  .route("/login")

  // Target: POST /api/auth/login
  .post(
    // Authenticate body data
    authenticateLoginUserBody,
    // Call controller
    loginUser
  )

router
  // Endpoint: /api/auth/logout
  .route("/logout")

  // Target: GET /api/auth/logout
  .get(
    // Call controller
    logoutUser
  )

export default router
