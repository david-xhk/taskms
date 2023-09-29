export async function createPlan(req, res, next) {
  const { username } = req.user
  const { plan, colour, startDate, endDate } = req.body
  const { project } = res.locals
  try {
    await project.createPlan(plan, colour, startDate, endDate, username)
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

export async function getAllPlans(req, res, next) {
  const { project } = res.locals
  try {
    const plans = await project.getAllPlans()
    res.json({ success: true, data: plans })
  } catch (err) {
    next(err)
  }
}
