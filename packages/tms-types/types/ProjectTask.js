import Base from "./Base.js"

export default class ProjectTask extends Base {
  /** @readonly @type {string} */
  project

  /** @readonly @type {string} */
  taskId

  /** @readonly @type {string} */
  taskName

  /** @readonly @type {string} */
  description

  /** @readonly @type {"open" | "todo" | "doing" | "done" | "closed"} */
  state

  /** @readonly @type {string?} */
  plan

  /** @readonly @type {number} */
  numNotes

  /** @readonly @type {string} */
  createdBy

  /** @readonly @type {Date} */
  createdAt

  /** @readonly @type {string} */
  updatedBy

  /** @readonly @type {Date} */
  updatedAt

  /**
   * @param {object} data
   * @param {string} data.project_name
   * @param {string} data.task_id
   * @param {string} data.task_name
   * @param {string} data.description
   * @param {ProjectTask["state"]} data.state
   * @param {string?} data.plan_name
   * @param {number} data.num_notes
   * @param {string} data.created_by
   * @param {Date} data.created_at
   * @param {string} data.updated_by
   * @param {Date} data.updated_at
   */
  constructor(data) {
    super()
    this.project = data.project_name
    this.taskId = data.task_id
    this.taskName = data.task_name
    this.description = data.description
    this.state = data.state
    this.plan = data.plan_name
    this.numNotes = data.num_notes
    this.createdBy = data.created_by
    this.createdAt = data.created_at
    this.updatedBy = data.updated_by
    this.updatedAt = data.updated_at
  }
}
