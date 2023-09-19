import { User, UserGroup } from "@han-keong/tms-db"

export async function getAllUsers(req, res, next) {
  let { q, active, group, groups, limit, page, offset } = req.query
  if (groups !== undefined || group !== undefined) {
    groups = groups ?? []
    if (group !== undefined) {
      groups.push(group)
    }
  }
  if (page !== undefined) {
    offset = (offset ?? 0) + (page - 1) * limit
  }
  const users = await User.findAll({ q, active, groups, limit, offset }).catch(next)
  res.json({ success: true, data: users })
}

export async function createUser(req, res, next) {
  let { username, email, password, active, groups } = req.body
  await User.insertOne(username, email, password, active).catch(next)
  if (groups && groups.length > 0) {
    await UserGroup.insertMany(groups.map(group => [username, group])).catch(next)
  }
  res.json({ success: true })
}
