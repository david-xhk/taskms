import bcrypt from "bcryptjs"

import { parseArray, parseBoolean, parseInteger, parseOrCreateArray } from "tms-all/helpers/parseHelper.js"

export default function parse(source, ...values) {
  return async function parsed(req, res, next) {
    const sourceObj = req[source]
    if (values.includes("username-or-usernames") && (sourceObj.usernames !== undefined || sourceObj.username !== undefined)) {
      sourceObj.usernames = parseOrCreateArray(sourceObj.usernames)
      if (sourceObj.username !== undefined) {
        sourceObj.usernames.push(sourceObj.username)
      }
    }
    if (values.includes("password") && sourceObj.password !== undefined) {
      sourceObj.password = await bcrypt.hash(sourceObj.password, 10).catch(next)
    }
    if (values.includes("active") && sourceObj.active !== undefined) {
      sourceObj.active = parseBoolean(sourceObj.active)
    }
    if (values.includes("groups") && sourceObj.groups !== undefined) {
      sourceObj.groups = parseArray(sourceObj.groups)
    }
    if (values.includes("group-or-groups") && (sourceObj.groups !== undefined || sourceObj.group !== undefined)) {
      sourceObj.groups = parseOrCreateArray(sourceObj.groups)
      if (sourceObj.group !== undefined) {
        sourceObj.groups.push(sourceObj.group)
      }
    }
    if (values.includes("limit") && sourceObj.limit !== undefined) {
      sourceObj.limit = parseInteger(sourceObj.limit)
    }
    if (values.includes("page") && sourceObj.page !== undefined) {
      sourceObj.page = parseInteger(sourceObj.page)
    }
    if (values.includes("offset") && sourceObj.offset !== undefined) {
      sourceObj.offset = parseInteger(sourceObj.offset)
    }
    next()
  }
}
