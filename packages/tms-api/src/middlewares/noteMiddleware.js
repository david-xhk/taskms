import { validateNoteNum } from "../validators/projectValidator.js"
import { ValidationError } from "./errorHandler.js"
import { validateParam } from "./validateRequest.js"

export async function note(req, res, next) {
  const { noteNum } = req.params
  const { task } = res.locals
  try {
    res.locals.note = await task.getNoteByNum(noteNum)
    next()
  } catch (err) {
    next(err)
  }
}

export const validateNoteNumParam = validateParam({
  validators: [validateNoteNum],
  postcondition: async (noteNum, req, res) => {
    if (await res.locals.task.noteNumNotExists(noteNum)) {
      return ValidationError.fromErrors({ taskNum: "Note not found." }, 404)
    }
  }
})
