export function getPlan(req, res) {
  const { plan } = res.locals
  res.json({ success: true, data: plan })
}

export async function updatePlan(req, res, next) {
  const { colour, startDate, endDate } = req.body
  const { plan } = res.locals
  const values = {}
  if (colour !== undefined && colour !== plan.colour) {
    values.colour = colour
  }
  if (startDate !== undefined && (startDate === null || plan.startDate === null || startDate.toDateString() !== plan.startDate.toDateString())) {
    values.startDate = startDate
  }
  if (endDate !== undefined && (endDate === null || plan.endDate === null || endDate.toDateString() !== plan.endDate.toDateString())) {
    values.endDate = endDate
  }
  if (Object.keys(values).length > 0) {
    try {
      await plan.update(values)
    } catch (err) {
      return next(err)
    }
  }
  res.json({ success: true })
}
