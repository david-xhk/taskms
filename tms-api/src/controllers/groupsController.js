import Group from "../models/Group.js"

export async function createGroups(req, res, next) {
  const { groups } = req.body
  if (groups !== undefined) {
    await Group.insertMany(groups).catch(next)
  }
  const newGroups = await Group.findAll().catch(next)
  res.json({ success: true, message: `New group${groups.length > 1 ? "s" : ""} created! 🌟`, data: newGroups })
}

export async function getAllGroups(req, res, next) {
  const groups = await Group.findAll().catch(next)
  res.json({ success: true, data: groups })
}
