import { Router } from "express"

import { createNote, getAllNotes } from "../controllers/notesController.js"
import { createNoteMiddleware } from "../middlewares/notesMiddleware.js"

const router = Router({ mergeParams: true })

router.get("/", getAllNotes)

router.post("/", ...createNoteMiddleware, createNote)

export default router
