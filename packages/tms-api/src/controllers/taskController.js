export function getTask(req, res) {
  const { task } = res.locals
  res.json({ success: true, data: task })
}

export async function updateTask(req, res, next) {
  const { username } = req.user
  const { state, plan } = req.body
  const { task } = res.locals
  const values = {}
  if (state !== undefined && state !== task.state) {
    values.state = state
  }
  if (plan !== undefined && plan !== task.plan) {
    values.plan = plan
  }
  if (Object.keys(values).length > 0) {
    try {
      await task.update(values, username)
    } catch (err) {
      return next(err)
    }
  }
  res.json({ success: true })
}
