import UserGroupModel from "../models/UserGroupModel.js"
import UserModel from "../models/UserModel.js"

export async function createUser(req, res, next) {
  const { username, email = null, password, active, groups } = req.body
  try {
    await UserModel.insertOne({ username, email, password, active })
    if (groups && groups.length > 0) {
      await UserGroupModel.insertMany(groups.map(group => ({ username, group })))
    }
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

export async function getAllUsers(req, res, next) {
  try {
    const users = await UserModel.findAll()
    res.json({ success: true, data: users })
  } catch (err) {
    next(err)
  }
}
