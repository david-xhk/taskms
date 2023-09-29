import Base from "./Base.js"

export default class TaskNote extends Base {
  /** @readonly @type {string} */
  taskId

  /** @readonly @type {string} */
  noteId

  /** @readonly @type {string} */
  content

  /** @readonly @type {string} */
  createdBy

  /** @readonly @type {Date} */
  createdAt

  /**
   * @param {object} data
   * @param {string} data.task_id
   * @param {string} data.note_id
   * @param {string} data.content
   * @param {string} data.created_by
   * @param {Date} data.created_at
   */
  constructor(data) {
    super()
    this.taskId = data.task_id
    this.noteId = data.note_id
    this.content = data.content
    this.createdBy = data.created_by
    this.createdAt = data.created_at
  }
}
