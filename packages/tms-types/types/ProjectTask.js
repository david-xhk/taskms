import { parseDate } from "@han-keong/tms-helpers/parseHelper"

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

  /** @readonly @type {("open" | "todo" | "doing" | "done" | "closed")?} */
  state

  /** @readonly @type {string?} */
  plan

  /** @readonly @type {string?} */
  colour

  /** @readonly @type {string?} */
  notes

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

  static parsers = {
    createdAt: parseDate,
    updatedAt: parseDate
  }

  /**
   * @param {object} data
   * @param {string} data.Task_app_Acronym
   * @param {string} data.Task_id
   * @param {string} data.Task_name
   * @param {string} data.Task_description
   * @param {ProjectTask["state"]} data.Task_state
   * @param {string?} data.Task_plan
   * @param {string?} data.Task_color
   * @param {string?} data.Task_notes
   * @param {number} data.num_notes
   * @param {string} data.Task_creator
   * @param {Date} data.Task_createDate
   * @param {string} data.Task_owner
   * @param {Date} data.updated_at
   */
  constructor(data) {
    super()
    this.project = data.Task_app_Acronym
    this.taskId = data.Task_id
    this.taskName = data.Task_name
    this.description = data.Task_description
    this.state = data.Task_state
    this.plan = data.Task_plan
    this.colour = data.Task_color
    this.notes = data.Task_notes
    this.numNotes = data.num_notes
    this.createdBy = data.Task_creator
    this.createdAt = data.Task_createDate
    this.updatedBy = data.Task_owner
    this.updatedAt = data.updated_at
  }

  get previousState() {
    switch (this.state) {
      case "todo":
        return "open"
      case "doing":
        return "todo"
      case "done":
        return "doing"
      case "closed":
        return "done"
      default:
        return null
    }
  }

  get nextState() {
    switch (this.state) {
      case "open":
        return "todo"
      case "todo":
        return "doing"
      case "doing":
        return "done"
      case "done":
        return "closed"
      default:
        return null
    }
  }

  isValidTransition(state) {
    switch (this.state) {
      case "open":
        return state === "open" || state === "todo"
      case "todo":
        return state === "todo" || state === "doing"
      case "doing":
        return state === "todo" || state === "doing" || state === "done"
      case "done":
        return state === "doing" || state === "done" || state === "closed"
      default:
        return false
    }
  }

  canEdit() {
    return this.state !== "closed"
  }

  canPromote() {
    return this.isValidTransition(this.nextState)
  }

  get promoteAlias() {
    switch (this.state) {
      case "open":
        return "release"
      case "todo":
        return "start"
      case "doing":
        return "submit"
      case "done":
        return "approve"
      default:
        return null
    }
  }

  canDemote() {
    return this.isValidTransition(this.previousState)
  }

  get demoteAlias() {
    switch (this.state) {
      case "doing":
        return "stop"
      case "done":
        return "reject"
      default:
        return null
    }
  }
}
