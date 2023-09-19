import jwt from "jsonwebtoken"

import { User } from "@han-keong/tms-db"

function getJwtToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_TIME })
}

function setJwtCookie(res, token) {
  let expiresTime = Date.now()
  if (token) {
    expiresTime += process.env.COOKIE_EXPIRES_DAYS * 24 * 60 * 60 * 1000
  }
  res.cookie("token", token || "none", { expires: new Date(expiresTime), httpOnly: true, sameSite: "none", secure: true })
}

export async function registerUser(req, res, next) {
  const { username, email, password } = req.body
  await User.insertOne(username, email, password, true).catch(next)
  const user = await User.findByUsername(username).catch(next)
  setJwtCookie(res, getJwtToken({ username }))
  res.json({ success: true, data: user })
}

export async function loginUser(req, res) {
  const token = getJwtToken({ username: req.user.username })
  setJwtCookie(res, token)
  res.json({ success: true, data: req.user })
}

export function logoutUser(req, res) {
  setJwtCookie(res, null)
  res.json({ success: true })
}
