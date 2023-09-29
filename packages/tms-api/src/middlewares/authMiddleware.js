import jwt from "jsonwebtoken"

import UserModel from "@han-keong/tms-models/UserModel"

import { ErrorMessage, ForbiddenError } from "./errorHandler.js"

export async function authentication(req, res, next) {
  const token = req.cookies?.token
  if (!token) {
    return next(new ErrorMessage("You must be logged in to access this resource.", 401))
  }
  let user
  const payload = jwt.verify(token, process.env.JWT_SECRET ?? "")
  if (payload) {
    try {
      user = await UserModel.findByUsername(payload["username"])
    } catch (err) {
      return next(err)
    }
  }
  if (!user?.active) {
    next(new ForbiddenError())
  } else {
    req.user = user
    next()
  }
}

export function authorization(args) {
  function authorized(req, res, next) {
    let groups = typeof args === "function" ? args(res.locals) : args
    if (!Array.isArray(groups)) {
      groups = [groups]
    }
    if (!req.user.isInGroups(groups)) {
      next(new ForbiddenError())
    } else {
      next()
    }
  }
  return authorized
}
