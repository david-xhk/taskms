import { Router } from "express"

import { getUser, updateUser } from "../controllers/userController.js"
import { updateUserMiddleware, user, validateUsernameParam } from "../middlewares/userMiddleware.js"

const router = Router()

router.param("username", validateUsernameParam)

router.use("/:username?", user)

router.get("/:username?", getUser)

router.patch("/:username?", ...updateUserMiddleware, updateUser)

export default router
