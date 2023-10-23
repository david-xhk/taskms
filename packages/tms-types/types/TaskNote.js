import { parseDate } from "@han-keong/tms-helpers/parseHelper"

import Base from "./Base.js"

export default class TaskNote extends Base {
  /** @readonly @type {string} */
  taskId

  /** @readonly @type {string} */
  noteId

  /** @readonly @type {string} */
  content

  /** @readonly @type {import("./ProjectTask.js").default["state"]?} */
  taskState

  /** @readonly @type {"new task" | "update task" | "user note"} */
  noteType

  /** @readonly @type {string} */
  createdBy

  /** @readonly @type {Date} */
  createdAt

  static parsers = {
    createdAt: parseDate
  }

  /**
   * @param {object} data
   * @param {string} data.Task_id
   * @param {string} data.note_id
   * @param {string} data.content
   * @param {TaskNote["taskState"]?} data.task_state
   * @param {TaskNote["noteType"]} data.note_type
   * @param {string} data.created_by
   * @param {Date} data.created_at
   */
  constructor(data) {
    super()
    this.taskId = data.Task_id
    this.noteId = data.note_id
    this.content = data.content
    this.taskState = data.task_state
    this.noteType = data.note_type
    this.createdBy = data.created_by
    this.createdAt = data.created_at
  }
}
