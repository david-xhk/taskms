import db from "@han-keong/tms-db"
import { insertSql, selectExistsSql, selectNotExistsSql, selectSql, updateSql } from "@han-keong/tms-helpers/sqlHelper"
import ProjectPlan from "@han-keong/tms-types/ProjectPlan"

export default class ProjectPlanModel extends ProjectPlan {
  refetch() {
    return ProjectPlanModel.findByProjectPlan(this.project, this.planName)
  }

  /**
   * @param {object} args
   * @param {string} [args.colour]
   * @param {Date} [args.startDate]
   * @param {Date} [args.endDate]
   */
  update(args) {
    const { colour, startDate, endDate } = args
    return ProjectPlanModel.updateByProjectPlan(this.project, this.planName, { colour, startDate, endDate })
  }

  /**
   * @param {object} args
   * @param {string} args.project
   * @param {string} args.plan
   * @param {string} args.colour
   * @param {Date} args.startDate
   * @param {Date} args.endDate
   * @param {string} args.createdBy
   */
  static insertOne(args) {
    const { project, plan, colour, startDate, endDate, createdBy } = args
    return ProjectPlanModel.insertMany([{ project, plan, colour, startDate, endDate, createdBy }])
  }

  /**
   * @param {object[]} args
   * @param {string} args[].project
   * @param {string} args[].plan
   * @param {string} args[].colour
   * @param {Date} args[].startDate
   * @param {Date} args[].endDate
   * @param {string} args[].createdBy
   * @returns {Promise<void>}
   */
  static insertMany(args) {
    const sql = insertSql("`Plan`", ["`Plan_app_Acronym`", "`Plan_MVP_name`", "`colour`", "`Plan_startDate`", "`Plan_endDate`", "`created_by`"])
    const values = args.map(({ project, plan, colour, startDate, endDate, createdBy }) => [project, plan, colour, startDate, endDate, createdBy])

    return new Promise((resolve, reject) => {
      db.query(sql, [values], (err, res) => {
        if (err) {
          reject(err)
        } else if (res.affectedRows === 0) {
          reject(`Failed to insert project plan${args.length > 1 ? "s" : ""}.`)
        } else {
          resolve()
        }
      })
    })
  }

  /**
   * @param {string} project
   * @param {string} plan
   * @returns {Promise<ProjectPlanModel?>}
   */
  static findByProjectPlan(project, plan) {
    const sql = selectSql("`Plan`", { where: "`Plan_app_Acronym` = ? AND `Plan_MVP_name` = ?" })

    return new Promise((resolve, reject) => {
      db.query(sql, [project, plan], (err, res) => {
        if (err) {
          reject(err)
        } else if (res.length === 0) {
          resolve(null)
        } else {
          resolve(new ProjectPlanModel(res[0]))
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
    return ProjectPlanModel.findAll({ project, limit, offset })
  }

  /**
   * @param {Date} startsAfter
   * @param {Date} [startsBefore]
   * @param {number} [limit]
   * @param {number} [offset]
   */
  static findByStartDate(startsAfter, startsBefore, limit, offset) {
    return ProjectPlanModel.findAll({ startsAfter, startsBefore, limit, offset })
  }

  /**
   * @param {Date} endsAfter
   * @param {Date} [endsBefore]
   * @param {number} [limit]
   * @param {number} [offset]
   */
  static findByEndDate(endsAfter, endsBefore, limit, offset) {
    return ProjectPlanModel.findAll({ endsAfter, endsBefore, limit, offset })
  }

  /**
   * @param {string} createdBy
   * @param {number} [limit]
   * @param {number} [offset]
   */
  static findByCreator(createdBy, limit, offset) {
    return ProjectPlanModel.findAll({ createdBy, limit, offset })
  }

  /**
   * @param {object} [args]
   * @param {string} [args.q]
   * @param {string} [args.project]
   * @param {Date} [args.startsAfter]
   * @param {Date} [args.startsBefore]
   * @param {Date} [args.endsAfter]
   * @param {Date} [args.endsBefore]
   * @param {string} [args.createdBy]
   * @param {number} [args.limit]
   * @param {number} [args.offset]
   * @returns {Promise<ProjectPlanModel[]>}
   */
  static findAll(args) {
    const { q, project, startsAfter, startsBefore, endsAfter, endsBefore, createdBy, limit, offset } = args ?? {}
    const options = {}
    const where = []
    const values = []
    if (q !== undefined) {
      where.push("`Plan_MVP_name` LIKE ?")
      values.push(`%${q}%`)
    }
    if (project !== undefined) {
      where.push("`Plan_app_Acronym` = ?")
      values.push(project)
    }
    if (startsAfter !== undefined) {
      where.push("DATEDIFF(`Plan_startDate`, ?) > 0")
      values.push(startsAfter)
    }
    if (startsBefore !== undefined) {
      where.push("DATEDIFF(?, `Plan_startDate`) > 0")
      values.push(startsBefore)
    }
    if (endsAfter !== undefined) {
      where.push("DATEDIFF(`Plan_endDate`, ?) > 0")
      values.push(endsAfter)
    }
    if (endsBefore !== undefined) {
      where.push("DATEDIFF(?, `Plan_endDate`) > 0")
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
    const sql = selectSql("`Plan`", options)

    return new Promise((resolve, reject) => {
      db.query(sql, values, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res.map(data => new ProjectPlanModel(data)))
        }
      })
    })
  }

  /**
   * @param {object} args
   * @param {string} args.project
   * @param {string} args.plan
   * @returns {Promise<boolean>}
   */
  static projectPlanExists(args) {
    const { project, plan } = args
    const sql = selectExistsSql("`Plan`", "`Plan_app_Acronym` = ? AND `Plan_MVP_name` = ?")

    return new Promise((resolve, reject) => {
      db.query(sql, [project, plan], (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(Boolean(res[0].exists))
        }
      })
    })
  }

  /**
   * @param {object} args
   * @param {string} args.project
   * @param {string} args.plan
   * @returns {Promise<boolean>}
   */
  static projectPlanNotExists(args) {
    const { project, plan } = args
    const sql = selectNotExistsSql("`Plan`", "`Plan_app_Acronym` = ? AND `Plan_MVP_name` = ?")

    return new Promise((resolve, reject) => {
      db.query(sql, [project, plan], (err, res) => {
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
   * @param {string} plan
   * @param {object} args
   * @param {string} [args.colour]
   * @param {Date} [args.startDate]
   * @param {Date} [args.endDate]
   * @returns {Promise<void>}
   */
  static updateByProjectPlan(project, plan, args) {
    const { colour, startDate, endDate } = args
    const columns = []
    const values = []
    if (colour !== undefined) {
      columns.push("`colour`")
      values.push(colour)
    }
    if (startDate !== undefined) {
      columns.push("`Plan_startDate`")
      values.push(startDate)
    }
    if (endDate !== undefined) {
      columns.push("`Plan_endDate`")
      values.push(endDate)
    }
    const sql = updateSql("`Plan`", columns, "`Plan_app_Acronym` = ? AND `Plan_MVP_name` = ?")
    values.push(project, plan)

    return new Promise((resolve, reject) => {
      db.query(sql, values, (err, res) => {
        if (err) {
          reject(err)
        } else if (res.affectedRows === 0) {
          reject("Failed to update project plan.")
        } else {
          resolve()
        }
      })
    })
  }
}
