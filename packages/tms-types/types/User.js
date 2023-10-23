import { hasIntersection } from "@han-keong/tms-helpers/arrayHelper"
import { parseDate } from "@han-keong/tms-helpers/parseHelper"

import Base from "./Base.js"

export default class User extends Base {
  /** @readonly @type {string} */
  username

  /** @readonly @type {string?} */
  email

  /** @readonly @type {boolean} */
  active

  /** @readonly @type {string[]} */
  groups

  /** @readonly @type {Date} */
  createdAt

  /** @readonly @type {Date} */
  updatedAt

  static parsers = {
    createdAt: parseDate,
    updatedAt: parseDate
  }

  /**
   * @param {object} data
   * @param {string} data.username
   * @param {string?} data.email
   * @param {boolean} data.active
   * @param {string?} data.groups
   * @param {Date} data.created_at
   * @param {Date} data.updated_at
   */
  constructor(data) {
    super()
    this.username = data.username
    this.email = data.email
    this.active = Boolean(data.active)
    this.groups = data.groups ? data.groups.split(",") : []
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  /**
   * @param {string} group
   */
  isInGroup(group) {
    return this.groups.includes(group)
  }

  /**
   * @param {string[]} groups
   */
  isInGroups(groups) {
    return hasIntersection(this.groups, groups)
  }

  get isAdmin() {
    return this.isInGroup("admin")
  }

  get isProjectLead() {
    return this.isInGroup("pl")
  }

  get isProjectManager() {
    return this.isInGroup("pm")
  }
}
