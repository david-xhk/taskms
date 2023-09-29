import { Router } from "express"

import { loginUser, logoutUser } from "../controllers/authController.js"

const router = Router()

router.post("/login", loginUser)

router.get("/logout", logoutUser)

export default router
