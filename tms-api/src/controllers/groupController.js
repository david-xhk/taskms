import UserGroup from "../models/UserGroup.js"

export async function getUsersInGroup(req, res, next) {
  const { group } = req.params
  const users = await UserGroup.findByGroup(group)
    .then(data => data.map(({ username }) => username))
    .catch(next)
  res.json({ success: true, data: users })
}

export async function addUsersToGroup(req, res, next) {
  const { group } = req.params
  const { usernames } = req.body
  await UserGroup.insertMany(usernames.map(username => [username, group])).catch(next)
  const users = await UserGroup.findByGroup(group)
    .then(data => data.map(({ username }) => username))
    .catch(next)
  res.json({ success: true, message: `User${usernames.length > 1 ? "s" : ""} added to group! ✨`, data: users })
}

export async function removeUsersFromGroup(req, res, next) {
  const { group } = req.params
  const { usernames } = req.body
  await UserGroup.deleteMany(usernames.map(username => [username, group])).catch(next)
  const users = await UserGroup.findByGroup(group)
    .then(data => data.map(({ username }) => username))
    .catch(next)
  res.json({ success: true, message: `User${usernames.length > 1 ? "s" : ""} removed from group! ✨`, data: users })
}
