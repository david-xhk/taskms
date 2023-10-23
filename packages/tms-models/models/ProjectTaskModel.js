import db from "@han-keong/tms-db"
import { insertSql, selectExistsSql, selectNotExistsSql, selectSql, updateSql } from "@han-keong/tms-helpers/sqlHelper"
import ProjectTask from "@han-keong/tms-types/ProjectTask"

import TaskNoteModel from "./TaskNoteModel.js"

export default class ProjectTaskModel extends ProjectTask {
  refetch() {
    return ProjectTaskModel.findByTaskId(this.taskId)
  }

  /**
   * @param {object} args
   * @param {ProjectTask["state"]} [args.state]
   * @param {string?} [args.plan]
   * @param {string} updatedBy
   */
  update(args, updatedBy) {
    const { state, plan } = args
    return ProjectTaskModel.updateByTaskId(this.taskId, { state, plan }, updatedBy)
  }

  /**
   * @param {string} content
   * @param {"update task" | "user note"} noteType
   * @param {string} createdBy
   */
  createNote(content, noteType, createdBy) {
    return TaskNoteModel.insertOne(this.taskId, content, noteType, createdBy)
  }

  /**
   * @param {number} noteNum
   */
  getNoteByNum(noteNum) {
    return TaskNoteModel.findByNoteId(`${this.taskId}_${noteNum}`)
  }

  getAllNotes() {
    return TaskNoteModel.findByTaskId(this.taskId)
  }

  /**
   * @param {number} noteNum
   */
  noteNumExists(noteNum) {
    return TaskNoteModel.noteIdExists(`${this.taskId}_${noteNum}`)
  }

  /**
   * @param {number} noteNum
   */
  noteNumNotExists(noteNum) {
    return TaskNoteModel.noteIdNotExists(`${this.taskId}_${noteNum}`)
  }

  /**
   * @param {object} args
   * @param {string} args.project
   * @param {string} args.task
   * @param {string} args.description
   * @param {string?} args.plan
   * @param {string} args.createdBy
   */
  static insertOne(args) {
    const { project, task, description, plan, createdBy } = args
    return ProjectTaskModel.insertMany([{ project, task, description, plan, createdBy }])
  }

  /**
   * @param {object[]} args
   * @param {string} args[].project
   * @param {string} args[].task
   * @param {string} args[].description
   * @param {string?} args[].plan
   * @param {string} args[].createdBy
   * @returns {Promise<void>}
   */
  static insertMany(args) {
    const sql = insertSql("`Task`", ["`Task_app_Acronym`", "`Task_name`", "`Task_description`", "`Task_plan`", "`Task_creator`"])
    const values = args.map(({ project, task, description, plan, createdBy }) => [project, task, description, plan, createdBy])

    return new Promise((resolve, reject) => {
      db.query(sql, [values], (err, res) => {
        if (err) {
          reject(err)
        } else if (res.affectedRows === 0) {
          reject(`Failed to insert project task${args.length > 1 ? "s" : ""}.`)
        } else {
          resolve()
        }
      })
    })
  }

  /**
   * @param {string} taskId
   * @returns {Promise<ProjectTaskModel?>}
   */
  static findByTaskId(taskId) {
    const sql = selectSql("`Task`", { where: "`Task_id` = ?" })

    return new Promise((resolve, reject) => {
      db.query(sql, taskId, (err, res) => {
        if (err) {
          reject(err)
        } else if (res.length === 0) {
          resolve(null)
        } else {
          resolve(new ProjectTaskModel(res[0]))
        }
      })
    })
  }

  /**
   * @param {string} project
   * @param {number} [limit]
   * @param {number} [offset]
   */
  static findByProjectName(project, limit, offset) {
    return ProjectTaskModel.findAll({ project, limit, offset })
  }

  /**
   * @param {string} project
   * @param {string} plan
   * @param {number} [limit]
   * @param {number} [offset]
   */
  static findByProjectPlan(project, plan, limit, offset) {
    return ProjectTaskModel.findAll({ project, plan, limit, offset })
  }

  /**
   * @param {string} project
   * @param {ProjectTask["state"]} state
   * @param {number} [limit]
   * @param {number} [offset]
   */
  static findByState(project, state, limit, offset) {
    return ProjectTaskModel.findAll({ project, state, limit, offset })
  }

  /**
   * @param {string} project
   * @param {string} createdBy
   * @param {number} [limit]
   * @param {number} [offset]
   */
  static findByCreator(project, createdBy, limit, offset) {
    return ProjectTaskModel.findAll({ project, createdBy, limit, offset })
  }

  /**
   * @param {string} project
   * @param {string} updatedBy
   * @param {number} [limit]
   * @param {number} [offset]
   */
  static findByUpdater(project, updatedBy, limit, offset) {
    return ProjectTaskModel.findAll({ project, updatedBy, limit, offset })
  }

  /**
   * @param {object} [args]
   * @param {string} [args.project]
   * @param {string} [args.plan]
   * @param {string} [args.q]
   * @param {ProjectTask["state"]} [args.state]
   * @param {string} [args.createdBy]
   * @param {string} [args.updatedBy]
   * @param {number} [args.limit]
   * @param {number} [args.offset]
   * @returns {Promise<ProjectTaskModel[]>}
   */
  static findAll(args) {
    const { q, project, plan, state, createdBy, updatedBy, limit, offset } = args ?? {}
    const options = {}
    const where = []
    const values = []
    if (q !== undefined) {
      where.push("`Task_name` LIKE ?")
      values.push(`%${q}%`)
    }
    if (project !== undefined) {
      where.push("`Task_app_Acronym` = ?")
      values.push(project)
    }
    if (plan !== undefined) {
      where.push("`Task_plan` = ?")
      values.push(plan)
    }
    if (state !== undefined) {
      where.push("`Task_state` = ?")
      values.push(state)
    }
    if (createdBy !== undefined) {
      where.push("`Task_creator` = ?")
      values.push(createdBy)
    }
    if (updatedBy !== undefined) {
      where.push("`Task_owner` = ?")
      values.push(updatedBy)
    }
    if (where.length > 0) {
      options.where = where.join(" AND ")
    }
    options.orderBy = "`Task_createDate` DESC"
    if (limit !== undefined) {
      options.limit = limit
      if (offset !== undefined) {
        options.offset = offset
      }
    }
    const sql = selectSql("`Task`", options)

    return new Promise((resolve, reject) => {
      db.query(sql, values, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res.map(data => new ProjectTaskModel(data)))
        }
      })
    })
  }

  /**
   * @param {string} taskId
   * @returns {Promise<boolean>}
   */
  static taskIdExists(taskId) {
    const sql = selectExistsSql("`Task`", "`Task_id` = ?")

    return new Promise((resolve, reject) => {
      db.query(sql, taskId, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(Boolean(res[0].exists))
        }
      })
    })
  }

  /**
   * @param {string} taskId
   * @returns {Promise<boolean>}
   */
  static taskIdNotExists(taskId) {
    const sql = selectNotExistsSql("`Task`", "`Task_id` = ?")

    return new Promise((resolve, reject) => {
      db.query(sql, taskId, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(Boolean(res[0].notExists))
        }
      })
    })
  }

  /**
   * @param {string} taskId
   * @param {object} args
   * @param {ProjectTask["state"]} [args.state]
   * @param {string?} [args.plan]
   * @param {string} updatedBy
   * @returns {Promise<void>}
   */
  static updateByTaskId(taskId, args, updatedBy) {
    const { state, plan } = args
    const columns = []
    const values = []
    if (state !== undefined) {
      columns.push("`Task_state`")
      values.push(state)
    }
    if (plan !== undefined) {
      columns.push("`Task_plan`")
      values.push(plan)
    }
    columns.push("`Task_owner`")
    values.push(updatedBy)
    const sql = updateSql("`Task`", columns, "`Task_id` = ?")
    values.push(taskId)

    return new Promise((resolve, reject) => {
      db.query(sql, values, (err, res) => {
        if (err) {
          reject(err)
        } else if (res.affectedRows === 0) {
          reject("Failed to update project task.")
        } else {
          resolve()
        }
      })
    })
  }
}
