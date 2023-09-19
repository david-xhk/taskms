import { Router } from "express"

import { addUsersToGroup, getUsersInGroup, removeUsersFromGroup } from "../controllers/groupController.js"
import { authentication, authorization } from "../middlewares/authMiddleware.js"
import { validateAddUsersToGroupBody, validateGroupParam, validateRemoveUsersFromGroupBody } from "../middlewares/groupMiddleware.js"
import parse from "../middlewares/parseMiddleware.js"

const router = Router()

router.use(authentication, authorization("admin"))

router.param("group", validateGroupParam)

router.get("/:group/users", getUsersInGroup)

router.post("/:group/users", validateAddUsersToGroupBody, parse("body", "username-or-usernames"), addUsersToGroup)

router.delete("/:group/users", validateRemoveUsersFromGroupBody, parse("body", "username-or-usernames"), removeUsersFromGroup)

export default router
