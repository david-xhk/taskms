import { capitalize } from "@han-keong/tms-helpers/stringHelper"

import ProjectModel from "../models/ProjectModel.js"
import ProjectPermitModel from "../models/ProjectPermitModel.js"

export async function createProject(req, res, next) {
  const { username } = req.user
  const { project, runningNum, startDate = null, endDate = null, description = null } = req.body
  try {
    await ProjectModel.insertOne({ project, runningNum, startDate, endDate, description, createdBy: username })
    for (let permit of ["create", "open", "todo", "doing", "done"]) {
      const permits = req.body["permit" + capitalize(permit)]
      if (permits && permits.length > 0) {
        await ProjectPermitModel.insertMany(permits.map(group => ({ project, permit, group })))
      }
    }
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

export async function getAllProjects(req, res, next) {
  try {
    const projects = await ProjectModel.findAll()
    res.json({ success: true, data: projects })
  } catch (err) {
    next(err)
  }
}
