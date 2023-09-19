import { getDifference } from "@han-keong/helpers"
import { UserGroup } from "@han-keong/tms-db"

export function getCurrentUser(req, res) {
  res.json({ success: true, data: req.user })
}

export async function getUserGroups(req, res, next) {
  const { username } = req.params
  let groups
  if (username === req.user.username) {
    groups = req.user.groups
  } else {
    groups = await UserGroup.findByUsername(username)
      .then(data => data.map(({ group }) => group))
      .catch(next)
  }
  res.json({ success: true, data: groups })
}

export async function checkUserGroups(req, res, next) {
  const { username } = req.params
  const { group, groups } = req.query
  let answer = true
  if (group !== undefined) {
    answer &&= await checkGroup(username, group).catch(next)
  }
  if (groups !== undefined) {
    answer &&= await UserGroup.userGroupsExist(groups.map(group => [username, group])).catch(next)
  }
  res.json({ success: true, data: answer })
}

async function checkGroup(username, group) {
  return await UserGroup.userGroupExists([username, group])
}

export function getUser(req, res) {
  const { user } = req.params
  res.json({ success: true, data: user })
}

export async function updateUser(req, res, next) {
  let { user } = req.params
  const { email, password, active, groups } = req.body
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
    await Promise.allSettled(promises).catch(next)
  }
  user = await user.refetch().catch(next)
  res.json({ success: true, data: user })
}
