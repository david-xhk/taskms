import mysql from "mysql2"

import { setDatabase } from "@han-keong/tms-db"

import { colorWords, formatColor } from "./middlewares/logMiddleware.js"

class MySqlDatabase {
  constructor() {
    this.pool = undefined
  }

  connect(config) {
    const pool = mysql.createPool(config)

    pool.getConnection(function (err, conn) {
      if (err) throw err
      console.log(`MySQL Database connected with host: ${conn.config.host}`)
      pool.releaseConnection(conn)
    })

    this.pool = pool
  }

  query(sql, ...args) {
    const callback = args.at(-1)
    if (args.length === 2) {
      sql = this.pool.format(sql, args[0])
    }
    this.logQuery(sql)
    return this.pool.query(sql, callback)
  }

  logQuery(sql) {
    const type = formatColor("SQL ", "purple")
    switch (sql.split(" ")[0]) {
      case "SELECT":
        sql = colorWords(sql, "green", 1)
        break
      case "INSERT":
        sql = colorWords(sql, "yellow", 1)
        break
      case "UPDATE":
        sql = colorWords(sql, "blue", 1)
        break
      case "DELETE":
        sql = colorWords(sql, "red", 1)
        break
    }
    const stack = this.getStack()
    console.log(`${type}|${sql}|${stack}`)
  }

  getStack() {
    let stack = new Error().stack.match(/[^\r\n]+/g)
    const end = stack.findIndex(line => line.includes("express"))
    stack = stack.slice(0, end)
    stack.reverse()
    const start = stack.length - stack.findIndex(line => !line.includes("tms/"))
    stack.reverse()
    stack = stack.slice(start)
    stack = stack.map(line => {
      line = line.trim().slice("at ".length)
      let fn
      if (/^[^(]+/.test(line)) {
        fn = line.split(" ")[0]
        line = line.split(" ").slice(1).join(" ")
      }
      line = line.replace(/^\((.+)\)$/, "$1")
      line = line.split("/").at(-1)
      return fn ? `${fn}@${line}` : line
    })
    return stack.join(",")
  }
}

const db = new MySqlDatabase()
setDatabase(db)

export default db
