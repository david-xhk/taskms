import { Router } from "express"

import { loginUser, logoutUser, registerUser } from "../controllers/authController.js"
import { authenticateLoginUserBody, validateRegisterUserBody } from "../middlewares/authMiddleware.js"
import parse from "../middlewares/parseMiddleware.js"

const router = Router()

router.post("/register", validateRegisterUserBody, parse("body", "password"), registerUser)

router.post("/login", authenticateLoginUserBody, loginUser)

router.get("/logout", logoutUser)

export default router
