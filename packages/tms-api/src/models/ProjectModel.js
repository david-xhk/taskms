import { insertSql, selectExistsSql, selectNotExistsSql, selectSql, updateSql } from "@han-keong/tms-helpers/sqlHelper"
import Project from "@han-keong/tms-types/Project"

import db from "../database.js"

import ProjectPermitModel from "./ProjectPermitModel.js"
import ProjectPlanModel from "./ProjectPlanModel.js"
import ProjectTaskModel from "./ProjectTaskModel.js"

export default class ProjectModel extends Project {
  refetch() {
    return ProjectModel.findByProjectName(this.projectName)
  }

  /**
   * @param {object} args
   * @param {Date?} [args.startDate]
   * @param {Date?} [args.endDate]
   * @param {string?} [args.description]
   */
  update(args) {
    const { startDate, endDate, description } = args
    return ProjectModel.updateByProjectName(this.projectName, { startDate, endDate, description })
  }

  /**
   * @param {keyof Project["permit"]} permit
   * @param {string} group
   */
  addGroupPermit(permit, group) {
    return ProjectPermitModel.insertOne(this.projectName, permit, group)
  }

  /**
   * @param {keyof Project["permit"]} permit
   * @param {string[]} groups
   */
  addGroupPermits(permit, groups) {
    const args = groups.map(group => ({ project: this.projectName, permit, group }))
    return ProjectPermitModel.insertMany(args)
  }

  /**
   * @param {keyof Project["permit"]} permit
   * @param {string} group
   */
  removeGroupPermit(permit, group) {
    return ProjectPermitModel.deleteOne(this.projectName, permit, group)
  }

  /**
   * @param {keyof Project["permit"]} permit
   * @param {string[]} groups
   */
  removeGroupPermits(permit, groups) {
    const args = groups.map(group => ({ project: this.projectName, permit, group }))
    return ProjectPermitModel.deleteMany(args)
  }

  /**
   * @param {string} plan
   * @param {string} colour
   * @param {Date} startDate
   * @param {Date} endDate
   * @param {string} createdBy
   */
  createPlan(plan, colour, startDate, endDate, createdBy) {
    return ProjectPlanModel.insertOne({ project: this.projectName, plan, colour, startDate, endDate, createdBy })
  }

  /**
   * @param {string} plan
   */
  getPlanByName(plan) {
    return ProjectPlanModel.findByProjectPlan(this.projectName, plan)
  }

  getAllPlans() {
    return ProjectPlanModel.findByProjectName(this.projectName)
  }

  /**
   * @param {string} plan
   */
  planExists(plan) {
    return ProjectPlanModel.projectPlanExists({ project: this.projectName, plan })
  }

  /**
   * @param {string} plan
   */
  planNotExists(plan) {
    return ProjectPlanModel.projectPlanNotExists({ project: this.projectName, plan })
  }

  /**
   * @param {string} task
   * @param {string} description
   * @param {string?} plan
   * @param {string} createdBy
   */
  createTask(task, description, plan, createdBy) {
    return ProjectTaskModel.insertOne({ project: this.projectName, task, description, plan, createdBy })
  }

  /**
   * @param {number} taskNum
   */
  getTaskByNum(taskNum) {
    return ProjectTaskModel.findByTaskId(`${this.projectName}_${taskNum}`)
  }

  /**
   * @param {string} createdBy
   */
  getLastCreatedTaskBy(createdBy) {
    return ProjectTaskModel.findByCreator(this.projectName, createdBy, 1).then(tasks => (tasks.length === 1 ? tasks[0] : null))
  }

  getAllTasks() {
    return ProjectTaskModel.findByProjectName(this.projectName)
  }

  /**
   * @param {NonNullable<ProjectTaskModel["state"]>} state
   */
  getTasksByState(state) {
    return ProjectTaskModel.findAll({ project: this.projectName, state })
  }

  /**
   * @param {number} taskNum
   */
  taskNumExists(taskNum) {
    return ProjectTaskModel.taskIdExists(`${this.projectName}_${taskNum}`)
  }

  /**
   * @param {number} taskNum
   */
  taskNumNotExists(taskNum) {
    return ProjectTaskModel.taskIdNotExists(`${this.projectName}_${taskNum}`)
  }

  /**
   * @param {object} args
   * @param {string} args.project
   * @param {number} args.runningNum
   * @param {Date?} args.startDate
   * @param {Date?} args.endDate
   * @param {string?} args.description
   * @param {string} args.createdBy
   */
  static insertOne(args) {
    const { project, runningNum, startDate, endDate, description, createdBy } = args
    return ProjectModel.insertMany([{ project, runningNum, startDate, endDate, description, createdBy }])
  }

  /**
   * @param {object[]} args
   * @param {string} args[].project
   * @param {number} args[].runningNum
   * @param {Date?} args[].startDate
   * @param {Date?} args[].endDate
   * @param {string?} args[].description
   * @param {string} args[].createdBy
   * @returns {Promise<void>}
   */
  static insertMany(args) {
    const sql = insertSql("`Application`", ["`App_Acronym`", "`App_Rnumber`", "`App_startDate`", "`App_endDate`", "`App_Description`", "`created_by`"])
    const values = args.map(({ project, runningNum, startDate, endDate, description, createdBy }) => [project, runningNum, startDate, endDate, description, createdBy])

    return new Promise((resolve, reject) => {
      db.query(sql, [values], (err, res) => {
        if (err) {
          reject(err)
        } else if (res.affectedRows === 0) {
          reject(`Failed to insert project${args.length > 1 ? "s" : ""}.`)
        } else {
          resolve()
        }
      })
    })
  }

  /**
   * @param {string} project
   * @returns {Promise<ProjectModel?>}
   */
  static findByProjectName(project) {
    const sql = selectSql("`Application`", { where: "`App_Acronym` = ?" })

    return new Promise((resolve, reject) => {
      db.query(sql, project, (err, res) => {
        if (err) {
          reject(err)
        } else if (res.length === 0) {
          resolve(null)
        } else {
          resolve(new ProjectModel(res[0]))
        }
      })
    })
  }

  /**
   * @param {Date} startsAfter
   * @param {Date} [startsBefore]
   * @param {number} [limit]
   * @param {number} [offset]
   */
  static findByStartDate(startsAfter, startsBefore, limit, offset) {
    return ProjectModel.findAll({ startsAfter, startsBefore, limit, offset })
  }

  /**
   * @param {Date} endsAfter
   * @param {Date} [endsBefore]
   * @param {number} [limit]
   * @param {number} [offset]
   */
  static findByEndDate(endsAfter, endsBefore, limit, offset) {
    return ProjectModel.findAll({ endsAfter, endsBefore, limit, offset })
  }

  /**
   * @param {string} createdBy
   * @param {number} [limit]
   * @param {number} [offset]
   */
  static findByCreator(createdBy, limit, offset) {
    return ProjectModel.findAll({ createdBy, limit, offset })
  }

  /**
   * @param {object} [args]
   * @param {string} [args.q]
   * @param {Date} [args.startsAfter]
   * @param {Date} [args.startsBefore]
   * @param {Date} [args.endsAfter]
   * @param {Date} [args.endsBefore]
   * @param {string} [args.createdBy]
   * @param {number} [args.limit]
   * @param {number} [args.offset]
   * @returns {Promise<ProjectModel[]>}
   */
  static findAll(args) {
    const { q, startsAfter, startsBefore, endsAfter, endsBefore, createdBy, limit, offset } = args ?? {}
    const options = {}
    const where = []
    const values = []
    if (q !== undefined) {
      where.push("`App_Acronym` LIKE ?")
      values.push(`%${q}%`)
    }
    if (startsAfter !== undefined) {
      where.push("DATEDIFF(`App_startDate`, ?) > 0")
      values.push(startsAfter)
    }
    if (startsBefore !== undefined) {
      where.push("DATEDIFF(?, `App_startDate`) > 0")
      values.push(startsBefore)
    }
    if (endsAfter !== undefined) {
      where.push("DATEDIFF(`App_endDate`, ?) > 0")
      values.push(endsAfter)
    }
    if (endsBefore !== undefined) {
      where.push("DATEDIFF(?, `App_endDate`) > 0")
      values.push(endsBefore)
    }
    if (createdBy !== undefined) {
      where.push("`created_by` = ?")
      values.push(createdBy)
    }
    if (where.length > 0) {
      options.where = where.join(" AND ")
    }
    options.orderBy = "`created_at` DESC"
    if (limit !== undefined) {
      options.limit = limit
      if (offset !== undefined) {
        options.offset = offset
      }
    }
    const sql = selectSql("`Application`", options)

    return new Promise((resolve, reject) => {
      db.query(sql, values, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res.map(data => new ProjectModel(data)))
        }
      })
    })
  }

  /**
   * @param {string} project
   * @returns {Promise<boolean>}
   */
  static projectExists(project) {
    const sql = selectExistsSql("`Application`", "`App_Acronym` = ?")

    return new Promise((resolve, reject) => {
      db.query(sql, project, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(Boolean(res[0].exists))
        }
      })
    })
  }

  /**
   * @param {string} project
   * @returns {Promise<boolean>}
   */
  static projectNotExists(project) {
    const sql = selectNotExistsSql("`Application`", "`App_Acronym` = ?")

    return new Promise((resolve, reject) => {
      db.query(sql, project, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(Boolean(res[0].notExists))
        }
      })
    })
  }

  /**
   * @param {string} project
   * @param {object} args
   * @param {Date?} [args.startDate]
   * @param {Date?} [args.endDate]
   * @param {string?} [args.description]
   * @returns {Promise<void>}
   */
  static updateByProjectName(project, args) {
    const { startDate, endDate, description } = args
    const columns = []
    const values = []
    if (startDate !== undefined) {
      columns.push("`App_startDate`")
      values.push(startDate)
    }
    if (endDate !== undefined) {
      columns.push("`App_endDate`")
      values.push(endDate)
    }
    if (description !== undefined) {
      columns.push("`App_Description`")
      values.push(description)
    }
    const sql = updateSql("`Application`", columns, "`App_Acronym` = ?")
    values.push(project)

    return new Promise((resolve, reject) => {
      db.query(sql, values, (err, res) => {
        if (err) {
          reject(err)
        } else if (res.affectedRows === 0) {
          reject("Failed to update project.")
        } else {
          resolve()
        }
      })
    })
  }
}
