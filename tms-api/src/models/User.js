import { hasIntersection } from "tms-all/helpers/arrayHelper.js"
import db from "../database.js"
import UserGroup from "./UserGroup.js"

class User {
  static async insertOne(username, email, password, active) {
    return await User.insertMany([{ username, email, password, active }])
  }

  static insertMany(users) {
    const sql = "INSERT INTO `users` (`username`, `email`, `password`, `active`) VALUES ?;"
    const values = users.map(({ username, email, password, active }) => [username, email, password, active ?? false])

    return new Promise((resolve, reject) => {
      db.query(sql, [values], (err, res) => {
        if (err) {
          reject(err)
        } else if (res.affectedRows === 0) {
          reject(`Failed to insert user${users.length > 1 ? "s" : ""}.`)
        } else {
          resolve()
        }
      })
    })
  }

  static async findByUsername(username) {
    return await User.findByUsernames([username])
  }

  static findByUsernames(usernames) {
    const sql = selectUsersSql("WHERE `users`.`username` IN ?")

    return new Promise((resolve, reject) => {
      db.query(sql, [[usernames]], (err, res) => {
        if (err) {
          return reject(err)
        }
        const data = res.map(data => new User(data))
        if (usernames.length === 1) {
          resolve(data[0])
        } else {
          resolve(data)
        }
      })
    })
  }

  static async findByEmail(email) {
    return await User.findByEmails([email])
  }

  static findByEmails(emails) {
    const sql = selectUsersSql("WHERE `users`.`email` IN ?")

    return new Promise((resolve, reject) => {
      db.query(sql, [[emails]], (err, res) => {
        if (err) {
          return reject(err)
        }
        const data = res.map(data => new User(data))
        if (emails.length === 1) {
          resolve(data[0])
        } else {
          resolve(data)
        }
      })
    })
  }

  static async findByGroup(group) {
    return await User.findByGroups([group])
  }

  static findByGroups(groups) {
    const sql = selectUsersSql("WHERE `group` IN ?")

    return new Promise((resolve, reject) => {
      db.query(sql, [[groups]], (err, res) => {
        if (err) {
          return reject(err)
        }
        const data = res.map(data => new User(data))
        if (groups.length === 1) {
          resolve(data[0])
        } else {
          resolve(data)
        }
      })
    })
  }

  static findAll({ q, active, groups, limit, offset }) {
    const where = []
    const values = []
    if (q !== undefined) {
      where.push("`users`.`username` LIKE ?")
      values.push(`%${q}%`)
    }
    if (active !== undefined) {
      where.push("`active` = ?")
      values.push(active)
    }
    if (groups !== undefined) {
      where.push("`group` IN ?")
      values.push([groups])
    }
    if (limit !== undefined) {
      values.push(limit)
    }
    if (limit !== undefined && offset !== undefined) {
      values.push(offset)
    }

    let whereClause
    if (where.length > 0) {
      whereClause = `WHERE ${where.join(" AND ")}`
    }
    const sql = selectUsersSql(whereClause, limit, offset)

    return new Promise((resolve, reject) => {
      db.query(sql, values, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res.map(data => new User(data)))
        }
      })
    })
  }

  static usernameExists(username) {
    const sql = "SELECT EXISTS(SELECT 1 FROM `users` WHERE `username` = ?) AS `exists`;"

    return new Promise((resolve, reject) => {
      db.query(sql, username, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res[0].exists)
        }
      })
    })
  }

  static usernameNotExists(username) {
    const sql = "SELECT NOT EXISTS(SELECT 1 FROM `users` WHERE `username` = ?) AS `notExists`;"

    return new Promise((resolve, reject) => {
      db.query(sql, username, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res[0].notExists)
        }
      })
    })
  }

  static emailExists(email) {
    const sql = "SELECT EXISTS(SELECT 1 FROM `users` WHERE `email` = ?) AS `exists`;"

    return new Promise((resolve, reject) => {
      db.query(sql, email, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res[0].exists)
        }
      })
    })
  }

  static emailNotExists(email) {
    const sql = "SELECT NOT EXISTS(SELECT 1 FROM `users` WHERE `email` = ?) AS `notExists`;"

    return new Promise((resolve, reject) => {
      db.query(sql, email, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res[0].notExists)
        }
      })
    })
  }

  static selectPasswordByUsername(username) {
    const sql = "SELECT `password` FROM `users` WHERE `username` = ?;"

    return new Promise((resolve, reject) => {
      db.query(sql, username, (err, res) => {
        if (err) {
          reject(err)
        } else if (res.length === 0) {
          reject("Username does not exist.")
        } else {
          resolve(res[0].password.toString())
        }
      })
    })
  }

  static updateByUsername(username, { email, password, active }) {
    let sql = "UPDATE `users` SET"
    const values = []
    for (let [key, value] of Object.entries({ email, password, active })) {
      if (value !== undefined) {
        sql += ` ?? = ?,`
        values.push(key)
        values.push(value)
      }
    }
    sql = sql.replace(/.$/, " WHERE `username` = ?;")
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

  constructor({ username, email, active, groups }) {
    this.username = username
    this.email = email
    this.active = Boolean(active)
    this.groups = groups ? groups.split(",") : []
    Object.freeze(this)
  }

  async refetch() {
    return await User.findByUsername(this.username)
  }

  async getPassword() {
    return await User.selectPasswordByUsername(this.username)
  }

  isInGroup(group) {
    return this.groups.includes(group)
  }

  isInGroups(groups) {
    return hasIntersection(groups, this.groups)
  }

  async addToGroup(group) {
    await UserGroup.insertOne(this.username, group)
  }

  async addToGroups(groups) {
    await UserGroup.insertMany(groups.map(group => [this.username, group]))
  }

  async removeFromGroup(group) {
    await UserGroup.deleteOne(this.username, group)
  }

  async removeFromGroups(groups) {
    await UserGroup.deleteMany(groups.map(group => [this.username, group]))
  }

  async update({ email, password, active }) {
    await User.updateByUsername(this.username, { email, password, active })
  }
}

function selectUsersSql(whereClause, limit, offset) {
  const sql = [
    "SELECT `users`.`username`, `email`, `active`,",
    // Combine user groups into a comma-separated string
    "GROUP_CONCAT(`group` ORDER BY `user_groups`.`created_at` SEPARATOR ',') AS `groups`",
    "FROM `users`",
    "LEFT OUTER JOIN `user_groups`",
    "ON `users`.`username` = `user_groups`.`username`"
  ]
  if (whereClause) {
    sql.push(whereClause)
  }
  sql.push("GROUP BY `users`.`username`")
  if (limit) {
    sql.push("LIMIT ?")
  }
  if (offset) {
    sql.push("OFFSET ?")
  }
  return sql.join(" ") + ";"
}

export default User
