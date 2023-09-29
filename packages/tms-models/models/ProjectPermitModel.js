import db from "@han-keong/tms-db"
import { deleteSql, insertSql, selectExistsSql, selectNotExistsSql, selectSql } from "@han-keong/tms-helpers/sqlHelper"
import ProjectPermit from "@han-keong/tms-types/ProjectPermit"

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
    const sql = insertSql("`project_permits`", ["`project_name`", "`permit`", "`group`"])
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
    const sql = selectSql("`project_permits`", { where: "`project_name` = ?" })

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
    const sql = selectSql("`project_permits`", { where: "`project_name` = ? AND `permit` = ?" })

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
    const sql = selectExistsSql("`project_permits`", "(`project_name`, `permit`, `group`) IN ?")
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
    const sql = selectNotExistsSql("`project_permits`", "(`project_name`, `permit`, `group`) IN ?")
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
    const sql = deleteSql("`project_permits`", "(`project_name`, `permit`, `group`) IN ?")
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
