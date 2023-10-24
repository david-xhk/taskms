import { Router } from "express"

import { getProject, updateProject } from "../controllers/projectController.js"
import { authorization } from "../middlewares/authMiddleware.js"
import { project, updateProjectMiddleware, validateProjectParam } from "../middlewares/projectMiddleware.js"

import planRouter from "./planRouter.js"
import plansRouter from "./plansRouter.js"
import taskRouter from "./taskRouter.js"
import tasksRouter from "./tasksRouter.js"

const router = Router()

router.param("project", validateProjectParam)

router.use("/:project", project)

router.get("/:project", getProject)

router.patch("/:project", authorization("pl"), ...updateProjectMiddleware, updateProject)

router.use("/:project/plan", planRouter)

router.use("/:project/plans", plansRouter)

router.use("/:project/task", taskRouter)

router.use("/:project/tasks", tasksRouter)

export default router
