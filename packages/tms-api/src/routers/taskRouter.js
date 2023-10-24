import { Router } from "express"

import { getTask, updateTask } from "../controllers/taskController.js"
import { task, updateTaskMiddleware, validateTaskNumParam } from "../middlewares/taskMiddleware.js"

import noteRouter from "./noteRouter.js"
import notesRouter from "./notesRouter.js"

const router = Router({ mergeParams: true })

router.param("taskNum", validateTaskNumParam)

router.use("/:taskNum", task)

router.get("/:taskNum", getTask)

router.patch("/:taskNum", ...updateTaskMiddleware, updateTask)

router.use("/:taskNum/note", noteRouter)

router.use("/:taskNum/notes", notesRouter)

export default router
