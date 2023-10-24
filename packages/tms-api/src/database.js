import mysql from "mysql2"

import { parseOrCreateArray } from "@han-keong/tms-helpers/parseHelper"
import { colorWords, formatColor } from "@han-keong/tms-helpers/stringHelper"

import config from "./config.js"

class Database {
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
      const values = parseOrCreateArray(args[0])
      sql = mysql.format(sql, values)
    }
    this.logQuery(sql)
    return this.pool?.query(sql, callback)
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
    switch (config.NODE_ENV) {
      case "production":
        return console.log(`${type}|${sql}`)
      case "development":
        return console.log(`${type}|${sql}|${this.getStack()}`)
    }
  }

  getStack() {
    let stack = Array.from(new Error().stack?.match(/[^\r\n]+/g) || [])
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
      let lines = line.replace(/^\((.+)\)$/, "$1").split("/")
      line = lines[lines.length - 1]
      return fn ? `${fn}@${line}` : line
    })
    return stack.join(",")
  }
}

const db = new Database()

export default db
