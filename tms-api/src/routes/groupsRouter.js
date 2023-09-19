import { Router } from "express"

import { createGroups, getAllGroups } from "../controllers/groupsController.js"
import { authentication, authorization } from "../middlewares/authMiddleware.js"
import { validateCreateGroupsBody } from "../middlewares/groupsMiddleware.js"
import parse from "../middlewares/parseMiddleware.js"

const router = Router()

router.use(authentication)

router.get("/", getAllGroups)

router.post("/", authorization("admin"), validateCreateGroupsBody, parse("body", "group-or-groups"), createGroups)

export default router
