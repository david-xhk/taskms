import GroupModel from "@han-keong/tms-models/GroupModel"

export async function createGroup(req, res, next) {
  const { group } = req.body
  try {
    await GroupModel.insertOne(group)
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

export async function getAllGroups(req, res, next) {
  try {
    const groups = await GroupModel.findAll()
    res.json({ success: true, data: groups })
  } catch (err) {
    next(err)
  }
}
