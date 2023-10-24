import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import config from "../config.js"
import { ErrorMessage } from "../middlewares/errorHandler.js"
import UserModel from "../models/UserModel.js"
import { validatePassword, validateUsername } from "../validators/userValidator.js"

export async function loginUser(req, res, next) {
  const { username, password } = req.body
  let authenticated = true
  authenticated &&= validateUsername(username)
  authenticated &&= validatePassword(password)
  const user = await UserModel.findByUsername(username).catch(() => null)
  const hash = await UserModel.selectPasswordByUsername(username).catch(() => null)
  authenticated &&= await bcrypt.compare(password, hash?.toString() ?? "").catch(() => false)
  if (!user || !user.active || !authenticated) {
    return next(new ErrorMessage("Invalid username or password", 401))
  }
  const token = getJwtToken({ username })
  setJwtCookie(res, token)
  res.json({ success: true, data: user })
}

export function logoutUser(req, res) {
  setJwtCookie(res, null)
  res.json({ success: true })
}

function getJwtToken(payload) {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_TIME })
}

function setJwtCookie(res, token) {
  let expiresTime = Date.now()
  if (token) {
    expiresTime += config.COOKIE_EXPIRES_DAYS * 24 * 60 * 60 * 1000
  }
  res.cookie("token", token || "none", { expires: new Date(expiresTime), httpOnly: true, sameSite: "none", secure: true })
}
