import { Router } from "express"

import { createUser, getAllUsers } from "../controllers/usersController.js"
import { authentication, authorization } from "../middlewares/authMiddleware.js"
import parse from "../middlewares/parseMiddleware.js"
import { validateCreateUserBody, validateGetAllUsersQuery } from "../middlewares/usersMiddleware.js"

const router = Router()

router.use(authentication, authorization("admin"))

router.get("/", validateGetAllUsersQuery, parse("query", "active", "groups", "limit", "page", "offset"), getAllUsers)

router.post("/", validateCreateUserBody, parse("body", "password", "active", "group-or-groups"), createUser)

export default router
