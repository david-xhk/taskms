import db from "@han-keong/tms-db"
import { insertSql, selectExistsSql, selectNotExistsSql, selectSql } from "@han-keong/tms-helpers/sqlHelper"
import TaskNote from "@han-keong/tms-types/TaskNote"

export default class TaskNoteModel extends TaskNote {
  /**
   * @param {string} taskId
   * @param {string} content
   * @param {string} createdBy
   */
  static insertOne(taskId, content, createdBy) {
    return TaskNoteModel.insertMany([{ taskId, content, createdBy }])
  }

  /**
   * @param {object[]} args
   * @param {string} args[].taskId
   * @param {string} args[].content
   * @param {string} args[].createdBy
   * @returns {Promise<void>}
   */
  static insertMany(args) {
    const sql = insertSql("`task_notes`", ["`task_id`", "`content`", "`created_by`"])
    const values = args.map(({ taskId, content, createdBy }) => [taskId, content, createdBy])

    return new Promise((resolve, reject) => {
      db.query(sql, [values], (err, res) => {
        if (err) {
          reject(err)
        } else if (res.affectedRows === 0) {
          reject(`Failed to insert task note${args.length > 1 ? "s" : ""}.`)
        } else {
          resolve()
        }
      })
    })
  }

  /**
   * @param {string} noteId
   * @returns {Promise<TaskNoteModel?>}
   */
  static findByNoteId(noteId) {
    const sql = selectSql("`task_notes`", { where: "`note_id` = ?" })

    return new Promise((resolve, reject) => {
      db.query(sql, noteId, (err, res) => {
        if (err) {
          reject(err)
        } else if (res.length === 0) {
          resolve(null)
        } else {
          resolve(new TaskNoteModel(res[0]))
        }
      })
    })
  }

  /**
   * @param {string} taskId
   * @returns {Promise<TaskNoteModel[]>}
   */
  static findByTaskId(taskId) {
    const sql = selectSql("`task_notes`", { where: "`task_id` = ?" })

    return new Promise((resolve, reject) => {
      db.query(sql, taskId, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res.map(data => new TaskNoteModel(data)))
        }
      })
    })
  }

  /**
   * @param {string} noteId
   * @returns {Promise<boolean>}
   */
  static noteIdExists(noteId) {
    const sql = selectExistsSql("`task_notes`", "`note_id` = ?")

    return new Promise((resolve, reject) => {
      db.query(sql, noteId, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(Boolean(res[0].exists))
        }
      })
    })
  }

  /**
   * @param {string} noteId
   * @returns {Promise<boolean>}
   */
  static noteIdNotExists(noteId) {
    const sql = selectNotExistsSql("`task_notes`", "`note_id` = ?")

    return new Promise((resolve, reject) => {
      db.query(sql, noteId, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(Boolean(res[0].notExists))
        }
      })
    })
  }
}
