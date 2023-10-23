import { getDifference } from "@han-keong/tms-helpers/arrayHelper"

export function getUser(req, res) {
  const { user } = res.locals
  res.json({ success: true, data: user })
}

export async function updateUser(req, res, next) {
  const { email, password, active, groups } = req.body
  const { user } = res.locals
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
    try {
      await user.update(values)
    } catch (err) {
      next(err)
    }
  }
  if (groups !== undefined) {
    const groupsToAdd = getDifference(groups, user.groups)
    if (groupsToAdd.length > 0) {
      try {
        await user.addToGroups(groupsToAdd)
      } catch (err) {
        next(err)
      }
    }
    const groupsToRemove = getDifference(user.groups, groups)
    if (groupsToRemove.length > 0) {
      try {
        await user.removeFromGroups(groupsToRemove)
      } catch (err) {
        next(err)
      }
    }
  }
  res.json({ success: true })
}
