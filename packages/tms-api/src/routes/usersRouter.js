import { Router } from "express"

import { createUser, getAllUsers } from "../controllers/usersController.js"
import { createUserMiddleware } from "../middlewares/usersMiddleware.js"

const router = Router()

router.get("/", getAllUsers)

router.post("/", ...createUserMiddleware, createUser)

export default router
