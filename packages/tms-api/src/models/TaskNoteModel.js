import { insertSql, selectExistsSql, selectNotExistsSql, selectSql } from "@han-keong/tms-helpers/sqlHelper"
import TaskNote from "@han-keong/tms-types/TaskNote"

import db from "../database.js"

export default class TaskNoteModel extends TaskNote {
  /**
   * @param {string} taskId
   * @param {string} content
   * @param {"update task" | "user note"} noteType
   * @param {string} createdBy
   */
  static insertOne(taskId, content, noteType, createdBy) {
    return TaskNoteModel.insertMany([{ taskId, content, createdBy, noteType }])
  }

  /**
   * @param {object[]} args
   * @param {string} args[].taskId
   * @param {string} args[].content
   * @param {"update task" | "user note"} args[].noteType
   * @param {string} args[].createdBy
   * @returns {Promise<void>}
   */
  static insertMany(args) {
    const sql = insertSql("`Note`", ["`Task_id`", "`content`", "`note_type`", "`created_by`"])
    const values = args.map(({ taskId, content, noteType, createdBy }) => [taskId, content, noteType, createdBy])

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
    const sql = selectSql("`Note`", { where: "`note_id` = ?" })

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
    const sql = selectSql("`Note`", { where: "`Task_id` = ?", orderBy: "`created_at` DESC" })

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
    const sql = selectExistsSql("`Note`", "`note_id` = ?")

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
    const sql = selectNotExistsSql("`Note`", "`note_id` = ?")

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
