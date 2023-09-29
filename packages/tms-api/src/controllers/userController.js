import { getDifference } from "@han-keong/tms-helpers/arrayHelper"

export function getUser(req, res) {
  const { user } = res.locals
  res.json({ success: true, data: user })
}

export async function updateUser(req, res, next) {
  const { email, password, active, groups } = req.body
  const { user } = res.locals
  const promises = []
  const values = {}
  if (email !== undefined && email !== user.email) {
    values.email = email
  }
  if (password !== undefined) {
    values.password = password
  }
  if (active !== undefined && active !== user.active) {
    values.active = active
  }
  if (Object.keys(values).length > 0) {
    promises.push(user.update(values))
  }
  if (groups !== undefined) {
    const groupsToAdd = getDifference(groups, user.groups)
    if (groupsToAdd.length > 0) {
      promises.push(user.addToGroups(groupsToAdd))
    }
    const groupsToRemove = getDifference(user.groups, groups)
    if (groupsToRemove.length > 0) {
      promises.push(user.removeFromGroups(groupsToRemove))
    }
  }
  if (promises.length > 0) {
    try {
      await Promise.allSettled(promises)
    } catch (err) {
      return next(err)
    }
  }
  res.json({ success: true })
}
