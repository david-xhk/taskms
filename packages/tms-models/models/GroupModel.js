import db from "@han-keong/tms-db"
import { insertSql, selectExistsSql, selectNotExistsSql, selectSql } from "@han-keong/tms-helpers/sqlHelper"
import Group from "@han-keong/tms-types/Group"

export default class GroupModel extends Group {
  /**
   * @param {string} group
   */
  static insertOne(group) {
    return GroupModel.insertMany([group])
  }

  /**
   * @param {string[]} groups
   * @returns {Promise<void>}
   */
  static insertMany(groups) {
    const sql = insertSql("`Group`", "`group`")
    const values = groups.map(group => [group])

    return new Promise((resolve, reject) => {
      db.query(sql, [values], (err, res) => {
        if (err) {
          reject(err)
        } else if (res.affectedRows === 0) {
          reject(`Failed to insert group${groups.length > 1 ? "s" : ""}.`)
        } else {
          resolve()
        }
      })
    })
  }

  /**
   * @returns {Promise<GroupModel[]>}
   */
  static findAll() {
    const sql = selectSql("`Group`", { orderBy: "`created_at` ASC" })

    return new Promise((resolve, reject) => {
      db.query(sql, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res.map(data => new GroupModel(data)))
        }
      })
    })
  }

  /**
   * @param {string} group
   * @returns {Promise<boolean>}
   */
  static groupExists(group) {
    const sql = selectExistsSql("`Group`", "`group` = ?")

    return new Promise((resolve, reject) => {
      db.query(sql, group, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(Boolean(res[0].exists))
        }
      })
    })
  }

  /**
   * @param {string} group
   * @returns {Promise<boolean>}
   */
  static groupNotExists(group) {
    const sql = selectNotExistsSql("`Group`", "`group` = ?")

    return new Promise((resolve, reject) => {
      db.query(sql, group, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(Boolean(res[0].notExists))
        }
      })
    })
  }
}
