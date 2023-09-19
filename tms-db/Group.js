import Base from "./Base.js"

export default class Group extends Base {
  static async insertOne(group) {
    return await Group.insertMany([group])
  }

  static insertMany(groups) {
    const sql = "INSERT INTO `groups` (`group`) VALUES ?;"
    const values = groups.map(group => [group])

    return new Promise((resolve, reject) => {
      Group.query(sql, [values], (err, res) => {
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

  static async findByGroup(group) {
    return await Group.findByGroups([group])
  }

  static findByGroups(groups) {
    const sql = "SELECT `group` FROM `groups` WHERE `group` IN ?;"

    return new Promise((resolve, reject) => {
      Group.query(sql, [[groups]], (err, res) => {
        if (err) {
          return reject(err)
        }
        const data = res.map(({ group }) => group)
        if (groups.length === 1) {
          resolve(data[0])
        } else {
          resolve(data)
        }
      })
    })
  }

  static findAll() {
    const sql = "SELECT `group` FROM `groups`;"

    return new Promise((resolve, reject) => {
      Group.query(sql, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res.map(({ group }) => group))
        }
      })
    })
  }

  static groupExists(group) {
    const sql = "SELECT EXISTS(SELECT 1 FROM `groups` WHERE `group` = ?) AS `exists`;"

    return new Promise((resolve, reject) => {
      Group.query(sql, group, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res[0].exists)
        }
      })
    })
  }

  static groupNotExists(group) {
    const sql = "SELECT NOT EXISTS(SELECT 1 FROM `groups` WHERE `group` = ?) AS `notExists`;"

    return new Promise((resolve, reject) => {
      Group.query(sql, group, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res[0].notExists)
        }
      })
    })
  }
}
