import { Router } from "express"

import { createProject, getAllProjects } from "../controllers/projectsController.js"
import { authorization } from "../middlewares/authMiddleware.js"
import { createProjectMiddleware } from "../middlewares/projectsMiddleware.js"

const router = Router()

router.get("/", getAllProjects)

router.post("/", authorization("pl"), ...createProjectMiddleware, createProject)

export default router
