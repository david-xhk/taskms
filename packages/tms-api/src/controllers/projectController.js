import { getDifference } from "@han-keong/tms-helpers/arrayHelper"
import { capitalize } from "@han-keong/tms-helpers/stringHelper"

export function getProject(req, res) {
  const { project } = res.locals
  res.json({ success: true, data: project })
}

export async function updateProject(req, res, next) {
  const { startDate, endDate, description } = req.body
  const { project } = res.locals
  const values = {}
  if (startDate !== undefined && (startDate === null || project.startDate === null || startDate.toDateString() !== project.startDate.toDateString())) {
    values.startDate = startDate
  }
  if (endDate !== undefined && (endDate === null || project.endDate === null || endDate.toDateString() !== project.endDate.toDateString())) {
    values.endDate = endDate
  }
  if (description !== undefined && description !== project.description) {
    values.description = description
  }
  if (Object.keys(values).length > 0) {
    try {
      await project.update(values)
    } catch (err) {
      next(err)
    }
  }
  for (let permit of ["create", "open", "todo", "doing", "done"]) {
    const permits = req.body["permit" + capitalize(permit)]
    if (permits !== undefined) {
      const permitsToAdd = getDifference(permits, project.permit[permit])
      if (permitsToAdd.length > 0) {
        try {
          await project.addGroupPermits(permit, permitsToAdd)
        } catch (err) {
          next(err)
        }
      }
      const permitsToRemove = getDifference(project.permit[permit], permits)
      if (permitsToRemove.length > 0) {
        try {
          await project.removeGroupPermits(permit, permitsToRemove)
        } catch (err) {
          next(err)
        }
      }
    }
  }
  res.json({ success: true })
}
