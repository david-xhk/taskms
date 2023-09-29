import Base from "./Base.js"

export default class Group extends Base {
  /** @readonly @type {string} */
  group

  /** @readonly @type {number} */
  numUsers

  /** @readonly @type {Date} */
  createdAt

  /**
   * @param {object} data
   * @param {string} data.group
   * @param {number} data.num_users
   * @param {Date} data.created_at
   */
  constructor(data) {
    super()
    this.group = data.group
    this.numUsers = data.num_users
    this.createdAt = data.created_at
  }
}
