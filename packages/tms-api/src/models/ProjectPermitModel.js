import { deleteSql, insertSql, selectExistsSql, selectNotExistsSql, selectSql } from "@han-keong/tms-helpers/sqlHelper"
import ProjectPermit from "@han-keong/tms-types/ProjectPermit"

import db from "../database.js"

export default class ProjectPermitModel extends ProjectPermit {
  delete() {
    return ProjectPermitModel.deleteOne(this.project, this.permit, this.group)
  }

  /**
   * @param {string} project
   * @param {ProjectPermit["permit"]} permit
   * @param {string} group
   */
  static insertOne(project, permit, group) {
    return ProjectPermitModel.insertMany([{ project, permit, group }])
  }

  /**
   * @param {object[]} args
   * @param {string} args[].project
   * @param {ProjectPermit["permit"]} args[].permit
   * @param {string} args[].group
   * @returns {Promise<void>}
   */
  static insertMany(args) {
    const sql = insertSql("`App_Permit`", ["`App_Acronym`", "`permit`", "`group`"])
    const values = args.map(({ project, permit, group }) => [project, permit, group])

    return new Promise((resolve, reject) => {
      db.query(sql, [values], (err, res) => {
        if (err) {
          reject(err)
        } else if (res.affectedRows === 0) {
          reject(`Failed to insert project permit${args.length > 1 ? "s" : ""}.`)
        } else {
          resolve()
        }
      })
    })
  }

  /**
   * @param {string} project
   * @returns {Promise<ProjectPermitModel[]>}
   */
  static findByProjectName(project) {
    const sql = selectSql("`App_Permit`", { where: "`App_Acronym` = ?", orderBy: "`created_at` DESC" })

    return new Promise((resolve, reject) => {
      db.query(sql, project, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res.map(data => new ProjectPermitModel(data)))
        }
      })
    })
  }

  /**
   * @param {string} project
   * @param {ProjectPermit["permit"]} permit
   * @returns {Promise<ProjectPermitModel[]>}
   */
  static findByProjectPermit(project, permit) {
    const sql = selectSql("`App_Permit`", { where: "`App_Acronym` = ? AND `permit` = ?", orderBy: "`created_at` DESC" })

    return new Promise((resolve, reject) => {
      db.query(sql, [project, permit], (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res.map(data => new ProjectPermitModel(data)))
        }
      })
    })
  }

  /**
   * @param {object} args
   * @param {string} args.project
   * @param {ProjectPermit["permit"]} args.permit
   * @param {string} args.group
   */
  static projectPermitExists(args) {
    const { project, permit, group } = args
    return ProjectPermitModel.projectPermitsExist([{ project, permit, group }])
  }

  /**
   * @param {object[]} args
   * @param {string} args[].project
   * @param {ProjectPermit["permit"]} args[].permit
   * @param {string} args[].group
   * @returns {Promise<boolean>}
   */
  static projectPermitsExist(args) {
    const sql = selectExistsSql("`App_Permit`", "(`App_Acronym`, `permit`, `group`) IN ?")
    const values = args.map(({ project, permit, group }) => [project, permit, group])

    return new Promise((resolve, reject) => {
      db.query(sql, [[values]], (err, res) => {
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
   * @param {ProjectPermit["permit"]} args.permit
   * @param {string} args.group
   */
  static projectPermitNotExists(args) {
    const { project, permit, group } = args
    return ProjectPermitModel.projectPermitsNotExist([{ project, permit, group }])
  }

  /**
   * @param {object[]} args
   * @param {string} args[].project
   * @param {ProjectPermit["permit"]} args[].permit
   * @param {string} args[].group
   * @returns {Promise<boolean>}
   */
  static projectPermitsNotExist(args) {
    const sql = selectNotExistsSql("`App_Permit`", "(`App_Acronym`, `permit`, `group`) IN ?")
    const values = args.map(({ project, permit, group }) => [project, permit, group])

    return new Promise((resolve, reject) => {
      db.query(sql, [[values]], (err, res) => {
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
   * @param {ProjectPermit["permit"]} permit
   * @param {string} group
   */
  static deleteOne(project, permit, group) {
    return ProjectPermitModel.deleteMany([{ project, permit, group }])
  }

  /**
   * @param {object[]} args
   * @param {string} args[].project
   * @param {ProjectPermit["permit"]} args[].permit
   * @param {string} args[].group
   * @returns {Promise<void>}
   */
  static deleteMany(args) {
    const sql = deleteSql("`App_Permit`", "(`App_Acronym`, `permit`, `group`) IN ?")
    const values = args.map(({ project, permit, group }) => [project, permit, group])

    return new Promise((resolve, reject) => {
      db.query(sql, [[values]], (err, res) => {
        if (err) {
          reject(err)
        } else if (res.affectedRows === 0) {
          reject(`Failed to delete project permit${args.length > 1 ? "s" : ""}.`)
        } else {
          resolve()
        }
      })
    })
  }
}
