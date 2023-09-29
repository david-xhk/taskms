import Base from "./Base.js"

export default class ProjectPermit extends Base {
  /** @readonly @type {string} */
  project

  /** @readonly @type {"create" | "open" | "todo" | "doing" | "done"} */
  permit

  /** @readonly @type {string} */
  group

  /** @readonly @type {Date} */
  createdAt

  /**
   * @param {object} data
   * @param {string} data.project_name
   * @param {ProjectPermit["permit"]} data.permit
   * @param {string} data.group
   * @param {Date} data.created_at
   */
  constructor(data) {
    super()
    this.project = data.project_name
    this.permit = data.permit
    this.group = data.group
    this.createdAt = data.created_at
  }
}
