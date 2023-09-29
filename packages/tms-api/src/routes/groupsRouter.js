import { Router } from "express"

import { createGroup, getAllGroups } from "../controllers/groupsController.js"
import { authorization } from "../middlewares/authMiddleware.js"
import { createGroupMiddleware } from "../middlewares/groupsMiddleware.js"

const router = Router()

router.get("/", getAllGroups)

router.post("/", authorization("admin"), ...createGroupMiddleware, createGroup)

export default router
