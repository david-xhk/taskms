import { Router } from "express"

import { getNote } from "../controllers/noteController.js"
import { note, validateNoteNumParam } from "../middlewares/noteMiddleware.js"

const router = Router({ mergeParams: true })

router.param("noteNum", validateNoteNumParam)

router.use("/:noteNum", note)

router.get("/:noteNum", getNote)

export default router
