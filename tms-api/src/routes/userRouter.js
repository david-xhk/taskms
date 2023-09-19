import { Router } from "express"

import { checkUserGroups, getCurrentUser, getUser, getUserGroups, updateUser } from "../controllers/userController.js"
import { authentication } from "../middlewares/authMiddleware.js"
import parse from "../middlewares/parseMiddleware.js"
import { fetchRequestedUser, validateCheckUserGroupsQuery, validateUpdateUserBody, validateUsernameParam } from "../middlewares/userMiddleware.js"

const router = Router()

router.use(authentication)

router.get("/", getCurrentUser)

router.param("username", validateUsernameParam)

router.get("/:username.groups", getUserGroups)

router.get("/:username.checkGroup", validateCheckUserGroupsQuery, parse("query", "group-or-groups"), checkUserGroups)

router.get("/:username", fetchRequestedUser, getUser)

router.put("/:username", fetchRequestedUser, validateUpdateUserBody, parse("body", "password", "active", "groups"), updateUser)

export default router
