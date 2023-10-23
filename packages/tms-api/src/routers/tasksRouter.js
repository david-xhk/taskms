import { Router } from "express"

import { createTask, getAllTasks } from "../controllers/tasksController.js"
import { createTaskMiddleware } from "../middlewares/tasksMiddleware.js"

const router = Router({ mergeParams: true })

router.get("/", getAllTasks)

router.post("/", ...createTaskMiddleware, createTask)

export default router
