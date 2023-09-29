import db from "@han-keong/tms-db"
import { insertSql, selectExistsSql, selectNotExistsSql, selectSql, updateSql } from "@han-keong/tms-helpers/sqlHelper"
import User from "@han-keong/tms-types/User"

import UserGroupModel from "./UserGroupModel.js"

export default class UserModel extends User {
  refetch() {
    return UserModel.findByUsername(this.username)
  }

  /**
   * @param {object} args
   * @param {string?} [args.email]
   * @param {string} [args.password]
   * @param {boolean} [args.active]
   */
  update(args) {
    const { email, password, active } = args
    return UserModel.updateByUsername(this.username, { email, password, active })
  }

  /**
   * @param {string} group
   */
  addToGroup(group) {
    return UserGroupModel.insertOne(this.username, group)
  }

  /**
   * @param {string[]} groups
   */
  addToGroups(groups) {
    const args = groups.map(group => ({ username: this.username, group }))
    return UserGroupModel.insertMany(args)
  }

  /**
   * @param {string} group
   */
  removeFromGroup(group) {
    return UserGroupModel.deleteOne(this.username, group)
  }

  /**
   * @param {string[]} groups
   */
  removeFromGroups(groups) {
    const args = groups.map(group => ({ username: this.username, group }))
    return UserGroupModel.deleteMany(args)
  }

  /**
   * @param {object} args
   * @param {string} args.username
   * @param {string?} args.email
   * @param {string} args.password
   * @param {boolean} args.active
   */
  static insertOne(args) {
    const { username, email, password, active } = args
    return UserModel.insertMany([{ username, email, password, active }])
  }

  /**
   * @param {object[]} args
   * @param {string} args[].username
   * @param {string?} args[].email
   * @param {string} args[].password
   * @param {boolean} args[].active
   * @returns {Promise<void>}
   */
  static insertMany(args) {
    const sql = insertSql("`users`", ["`username`", "`email`", "`password`", "`active`"])
    const values = args.map(({ username, email, password, active }) => [username, email, password, active])

    return new Promise((resolve, reject) => {
      db.query(sql, [values], (err, res) => {
        if (err) {
          reject(err)
        } else if (res.affectedRows === 0) {
          reject(`Failed to insert user${args.length > 1 ? "s" : ""}.`)
        } else {
          resolve()
        }
      })
    })
  }

  /**
   * @param {string} username
   * @returns {Promise<UserModel?>}
   */
  static async findByUsername(username) {
    const sql = selectSql("`users`", { where: "`username` = ?" })

    return new Promise((resolve, reject) => {
      db.query(sql, username, (err, res) => {
        if (err) {
          reject(err)
        } else if (res.length === 0) {
          resolve(null)
        } else {
          resolve(new UserModel(res[0]))
        }
      })
    })
  }

  /**
   * @param {string} username
   * @returns {Promise<string?>}
   */
  static selectPasswordByUsername(username) {
    const sql = selectSql("`users`", { columns: "`password`", where: "`username` = ?" })

    return new Promise((resolve, reject) => {
      db.query(sql, username, (err, res) => {
        if (err) {
          reject(err)
        } else if (res.length === 0) {
          resolve(null)
        } else {
          resolve(res[0].password.toString())
        }
      })
    })
  }

  /**
   * @param {string} email
   * @returns {Promise<UserModel?>}
   */
  static async findByEmail(email) {
    const sql = selectSql("`users`", { where: "`email` = ?" })

    return new Promise((resolve, reject) => {
      db.query(sql, email, (err, res) => {
        if (err) {
          reject(err)
        } else if (res.length === 0) {
          resolve(null)
        } else {
          resolve(new UserModel(res[0]))
        }
      })
    })
  }

  /**
   * @param {boolean} active
   * @param {number} [limit]
   * @param {number} [offset]
   */
  static findByActive(active, limit, offset) {
    return UserModel.findAll({ active, limit, offset })
  }

  /**
   * @param {string} group
   * @param {number} [limit]
   * @param {number} [offset]
   */
  static findByGroup(group, limit, offset) {
    return UserModel.findAll({ groups: [group], limit, offset })
  }

  /**
   * @param {string[]} groups
   * @param {number} [limit]
   * @param {number} [offset]
   */
  static findByGroups(groups, limit, offset) {
    return UserModel.findAll({ groups, limit, offset })
  }

  /**
   * @param {object} [args]
   * @param {string} [args.q]
   * @param {boolean} [args.active]
   * @param {string[]} [args.groups]
   * @param {number} [args.limit]
   * @param {number} [args.offset]
   * @returns {Promise<UserModel[]>}
   */
  static findAll(args) {
    const { q, active, groups, limit, offset } = args ?? {}
    const options = {}
    const where = []
    const values = []
    if (q !== undefined) {
      where.push("`username` LIKE ?")
      values.push(`%${q}%`)
    }
    if (active !== undefined) {
      where.push("`active` = ?")
      values.push(active)
    }
    if (groups !== undefined) {
      where.push("`group` IN ?")
      values.push([groups])
      options.join = "`user_groups`"
      options.on = "`user_groups`.`username` = `users`.`username`"
      options.columns = "`users`.*"
    }
    if (where.length > 0) {
      options.where = where.join(" AND ")
    }
    if (limit !== undefined) {
      options.limit = limit
      if (offset !== undefined) {
        options.offset = offset
      }
    }
    const sql = selectSql("`users`", options)

    return new Promise((resolve, reject) => {
      db.query(sql, values, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res.map(data => new UserModel(data)))
        }
      })
    })
  }

  /**
   * @param {string} username
   * @returns {Promise<boolean>}
   */
  static usernameExists(username) {
    const sql = selectExistsSql("`users`", "`username` = ?")

    return new Promise((resolve, reject) => {
      db.query(sql, username, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(Boolean(res[0].exists))
        }
      })
    })
  }

  /**
   * @param {string} username
   * @returns {Promise<boolean>}
   */
  static usernameNotExists(username) {
    const sql = selectNotExistsSql("`users`", "`username` = ?")

    return new Promise((resolve, reject) => {
      db.query(sql, username, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(Boolean(res[0].notExists))
        }
      })
    })
  }

  /**
   * @param {string} email
   * @returns {Promise<boolean>}
   */
  static emailExists(email) {
    const sql = selectExistsSql("`users`", "`email` = ?")

    return new Promise((resolve, reject) => {
      db.query(sql, email, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(Boolean(res[0].exists))
        }
      })
    })
  }

  /**
   * @param {string} email
   * @returns {Promise<boolean>}
   */
  static emailNotExists(email) {
    const sql = selectNotExistsSql("`users`", "`email` = ?")

    return new Promise((resolve, reject) => {
      db.query(sql, email, (err, res) => {
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
   * @param {object} args
   * @param {string?} [args.email]
   * @param {string} [args.password]
   * @param {boolean} [args.active]
   * @returns {Promise<void>}
   */
  static updateByUsername(username, args) {
    const { email, password, active } = args
    const columns = []
    const values = []
    if (email !== undefined) {
      columns.push("`email`")
      values.push(email)
    }
    if (password !== undefined) {
      columns.push("`password`")
      values.push(password)
    }
    if (active !== undefined) {
      columns.push("`active`")
      values.push(active)
    }
    const sql = updateSql("`users`", columns, "`username` = ?")
    values.push(username)

    return new Promise((resolve, reject) => {
      db.query(sql, values, (err, res) => {
        if (err) {
          reject(err)
        } else if (res.affectedRows === 0) {
          reject("Failed to update user.")
        } else {
          resolve()
        }
      })
    })
  }
}
