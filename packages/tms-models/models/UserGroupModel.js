import db from "@han-keong/tms-db"
import { deleteSql, insertSql, selectExistsSql, selectNotExistsSql, selectSql } from "@han-keong/tms-helpers/sqlHelper"
import UserGroup from "@han-keong/tms-types/UserGroup"

export default class UserGroupModel extends UserGroup {
  /**
   * @param {string} username
   * @param {string} group
   */
  static insertOne(username, group) {
    return UserGroupModel.insertMany([{ username, group }])
  }

  /**
   * @param {object[]} args
   * @param {string} args[].username
   * @param {string} args[].group
   * @returns {Promise<void>}
   */
  static insertMany(args) {
    const sql = insertSql("`user_groups`", ["`username`", "`group`"])
    const values = args.map(({ username, group }) => [username, group])

    return new Promise((resolve, reject) => {
      db.query(sql, [values], (err, res) => {
        if (err) {
          reject(err)
        } else if (res.affectedRows === 0) {
          reject(`Failed to insert user group${args.length > 1 ? "s" : ""}.`)
        } else {
          resolve()
        }
      })
    })
  }

  /**
   * @param {string} username
   * @returns {Promise<UserGroupModel[]>}
   */
  static findByUsername(username) {
    const sql = selectSql("`user_groups`", { where: "`username` = ?" })

    return new Promise((resolve, reject) => {
      db.query(sql, username, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res.map(data => new UserGroupModel(data)))
        }
      })
    })
  }

  /**
   * @param {string} group
   * @returns {Promise<UserGroupModel[]>}
   */
  static findByGroup(group) {
    const sql = selectSql("`user_groups`", { where: "`group` = ?" })

    return new Promise((resolve, reject) => {
      db.query(sql, group, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res.map(data => new UserGroupModel(data)))
        }
      })
    })
  }

  /**
   * @param {object} args
   * @param {string} args.username
   * @param {string} args.group
   * @returns {Promise<boolean>}
   */
  static userGroupExists(args) {
    const { username, group } = args
    return UserGroupModel.userGroupsExist([{ username, group }])
  }

  /**
   * @param {object[]} args
   * @param {string} args[].username
   * @param {string} args[].group
   * @returns {Promise<boolean>}
   */
  static userGroupsExist(args) {
    const sql = selectExistsSql("`user_groups`", "(`username`, `group`) IN ?")
    const values = args.map(({ username, group }) => [username, group])

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
   * @param {string} args.username
   * @param {string} args.group
   * @returns {Promise<boolean>}
   */
  static userGroupNotExists(args) {
    const { username, group } = args
    return UserGroupModel.userGroupsNotExist([{ username, group }])
  }

  /**
   * @param {object[]} args
   * @param {string} args[].username
   * @param {string} args[].group
   * @returns {Promise<boolean>}
   */
  static userGroupsNotExist(args) {
    const sql = selectNotExistsSql("`user_groups`", "(`username`, `group`) IN ?")
    const values = args.map(({ username, group }) => [username, group])

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
   * @param {string} username
   * @param {string} group
   */
  static deleteOne(username, group) {
    return UserGroupModel.deleteMany([{ username, group }])
  }

  /**
   * @param {object[]} args
   * @param {string} args[].username
   * @param {string} args[].group
   * @returns {Promise<void>}
   */
  static deleteMany(args) {
    const sql = deleteSql("`user_groups`", "(`username`, `group`) IN ?")
    const values = args.map(({ username, group }) => [username, group])

    return new Promise((resolve, reject) => {
      db.query(sql, [[values]], (err, res) => {
        if (err) {
          reject(err)
        } else if (res.affectedRows === 0) {
          reject(`Failed to delete user group${args.length > 1 ? "s" : ""}.`)
        } else {
          resolve()
        }
      })
    })
  }
}
