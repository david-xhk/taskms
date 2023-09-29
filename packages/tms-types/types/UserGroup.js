import Base from "./Base.js"

export default class UserGroup extends Base {
  /** @readonly @type {string} */
  username

  /** @readonly @type {string} */
  group

  /** @readonly @type {Date} */
  createdAt

  /**
   * @param {object} data
   * @param {string} data.username
   * @param {string} data.group
   * @param {Date} data.created_at
   */
  constructor(data) {
    super()
    this.username = data.username
    this.group = data.group
    this.createdAt = data.created_at
  }
}
