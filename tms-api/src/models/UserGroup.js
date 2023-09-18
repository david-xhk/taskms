import db from "../database.js"

class UserGroup {
  static async insertOne(username, group) {
    return await UserGroup.insertMany([[username, group]])
  }

  static insertMany(userGroups) {
    const sql = "INSERT INTO `user_groups` (`username`, `group`) VALUES ?;"

    return new Promise((resolve, reject) => {
      db.query(sql, [userGroups], (err, res) => {
        if (err) {
          reject(err)
        } else if (res.affectedRows === 0) {
          reject(`Failed to insert user group${userGroups.length > 1 ? "s" : ""}.`)
        } else {
          resolve()
        }
      })
    })
  }

  static async findByUsername(username) {
    return await UserGroup.findByUsernames([username])
  }

  static findByUsernames(usernames) {
    const sql = "SELECT `username`, `group` FROM `user_groups` WHERE `username` IN ?;"

    return new Promise((resolve, reject) => {
      db.query(sql, [[usernames]], (err, res) => {
        if (err) {
          return reject(err)
        }
        resolve(res.map(({ username, group }) => ({ username, group })))
      })
    })
  }

  static async findByGroup(group) {
    return await UserGroup.findByGroups([group])
  }

  static findByGroups(groups) {
    const sql = "SELECT `username`, `group` FROM `user_groups` WHERE `group` IN ?;"

    return new Promise((resolve, reject) => {
      db.query(sql, [[groups]], (err, res) => {
        if (err) {
          return reject(err)
        }
        resolve(res.map(({ username, group }) => ({ username, group })))
      })
    })
  }

  static userGroupExists([username, group]) {
    const sql = "SELECT EXISTS (SELECT 1 FROM `user_groups` WHERE (`username`, `group`) = ?) AS `exists`;"

    return new Promise((resolve, reject) => {
      db.query(sql, [[[username, group]]], (err, res) => {
        if (err) {
          return reject(err)
        }
        resolve(Boolean(res[0].exists))
      })
    })
  }

  static userGroupsExist(userGroups) {
    const sql = "SELECT EXISTS (SELECT 1 FROM `user_groups` WHERE (`username`, `group`) IN ?) AS `exists`;"

    return new Promise((resolve, reject) => {
      db.query(sql, [[userGroups]], (err, res) => {
        if (err) {
          return reject(err)
        }
        resolve(Boolean(res[0].exists))
      })
    })
  }

  static userGroupNotExists([username, group]) {
    const sql = "SELECT NOT EXISTS (SELECT 1 FROM `user_groups` WHERE (`username`, `group`) = ?) AS `notExists`;"

    return new Promise((resolve, reject) => {
      db.query(sql, [[[username, group]]], (err, res) => {
        if (err) {
          return reject(err)
        }
        resolve(Boolean(res[0].notExists))
      })
    })
  }

  static userGroupsNotExist(userGroups) {
    const sql = "SELECT NOT EXISTS (SELECT 1 FROM `user_groups` WHERE (`username`, `group`) IN ?) AS `notExists`;"

    return new Promise((resolve, reject) => {
      db.query(sql, [[userGroups]], (err, res) => {
        if (err) {
          return reject(err)
        }
        resolve(Boolean(res[0].notExists))
      })
    })
  }

  static async deleteOne(username, group) {
    return await UserGroup.deleteMany([[username, group]])
  }

  static deleteMany(userGroups) {
    const sql = "DELETE FROM `user_groups` WHERE (`username`, `group`) IN ?;"

    return new Promise((resolve, reject) => {
      db.query(sql, [[userGroups]], (err, res) => {
        if (err) {
          reject(err)
        } else if (res.affectedRows === 0) {
          reject(`Failed to delete user group${userGroups.length > 1 ? "s" : ""}.`)
        } else {
          resolve()
        }
      })
    })
  }
}

export default UserGroup
