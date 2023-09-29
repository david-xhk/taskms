import Base from "./Base.js"

export default class ProjectPlan extends Base {
  /** @readonly @type {string} */
  project

  /** @readonly @type {string} */
  planName

  /** @readonly @type {string} */
  colour

  /** @readonly @type {Date} */
  startDate

  /** @readonly @type {Date} */
  endDate

  /** @readonly @type {number} */
  numTasks

  /** @readonly @type {string} */
  createdBy

  /** @readonly @type {Date} */
  createdAt

  /** @readonly @type {Date} */
  updatedAt

  /**
   * @param {object} data
   * @param {string} data.project_name
   * @param {string} data.plan_name
   * @param {string} data.colour
   * @param {Date} data.start_date
   * @param {Date} data.end_date
   * @param {number} data.num_tasks
   * @param {string} data.created_by
   * @param {Date} data.created_at
   * @param {Date} data.updated_at
   */
  constructor(data) {
    super()
    this.project = data.project_name
    this.planName = data.plan_name
    this.colour = data.colour
    this.startDate = data.start_date
    this.endDate = data.end_date
    this.numTasks = data.num_tasks
    this.createdBy = data.created_by
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }
}
