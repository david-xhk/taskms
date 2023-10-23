export async function createTask(req, res, next) {
  const { username } = req.user
  const { task, description, plan = null, note = null } = req.body
  const { project } = res.locals
  try {
    await project.createTask(task, description, plan, username)
    const newTask = await project.getLastCreatedTaskBy(username)
    if (note) {
      await newTask.createNote(note, "user note", username)
    }
    await newTask.update({ state: "open" }, username)
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

export async function getAllTasks(req, res, next) {
  const { project } = res.locals
  try {
    const tasks = await project.getAllTasks()
    res.json({ success: true, data: tasks })
  } catch (err) {
    next(err)
  }
}
