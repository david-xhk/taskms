export async function createNote(req, res, next) {
  const { username } = req.user
  const { content } = req.body
  const { task } = res.locals
  try {
    await task.createNote(content, username)
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

export async function getAllNotes(req, res, next) {
  const { task } = res.locals
  try {
    const notes = await task.getAllNotes()
    res.json({ success: true, data: notes })
  } catch (err) {
    next(err)
  }
}
