import config from "../config.js"
import { sendEmail } from "../helpers/emailHelper.js"
import UserModel from "../models/UserModel.js"

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
    const updates = Object.entries(values).map(([key, value]) => `${key} updated to "${value}"`)
    try {
      await task.createNote("Task " + updates.join(" and ") + ".", "update task", username)
      await task.update(values, username)
    } catch (err) {
      return next(err)
    }
  }
  if (task.state === "doing" && state === "done") {
    try {
      await notifyProjectLeads(req, res)
    } catch (err) {
      next(err)
    }
  }
  res.json({ success: true })
}

export async function notifyProjectLeads(req, res) {
  const { username } = req.user
  const { task } = res.locals
  const link = `${config.WEB_BASE_URL}/apps/${task.project}/tasks/${task.taskId.split("_")[1]}`
  for (let projectLead of await UserModel.findByGroup("pl")) {
    if (projectLead.email) {
      sendEmail({
        to: projectLead.email,
        subject: `${task.project}: Task ${task.taskName} Completed`,
        text: `Dear ${projectLead.username},

A task has been promoted to the "Done" state. You may review the completed task at this link: ${link}.

Task ID: ${task.taskId}
Task Name: ${task.taskName}
Task Plan: ${task.plan}
Task Owner: ${username}
Task Updated At: ${new Date().toString()}

This email was automatically generated. Please do not reply to this email.`
      })
    }
  }
}
