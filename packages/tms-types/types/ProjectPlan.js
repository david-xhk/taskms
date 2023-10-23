import { parseDate } from "@han-keong/tms-helpers/parseHelper"

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

  static parsers = {
    startDate: parseDate,
    endDate: parseDate,
    createdAt: parseDate,
    updatedAt: parseDate
  }

  /**
   * @param {object} data
   * @param {string} data.Plan_app_Acronym
   * @param {string} data.Plan_MVP_name
   * @param {string} data.colour
   * @param {Date} data.Plan_startDate
   * @param {Date} data.Plan_endDate
   * @param {number} data.num_tasks
   * @param {string} data.created_by
   * @param {Date} data.created_at
   * @param {Date} data.updated_at
   */
  constructor(data) {
    super()
    this.project = data.Plan_app_Acronym
    this.planName = data.Plan_MVP_name
    this.colour = data.colour
    this.startDate = data.Plan_startDate
    this.endDate = data.Plan_endDate
    this.numTasks = data.num_tasks
    this.createdBy = data.created_by
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }
}
