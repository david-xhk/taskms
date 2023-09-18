import mysql from "mysql2"
import { colorWords, formatColor, getDateTimeNow, getReqId } from "./middlewares/logMiddleware.js"

class MySqlDatabase {
  constructor() {
    this.pool = undefined
  }

  connect(config) {
    const pool = mysql.createPool(config)

    pool.getConnection(function (err, conn) {
      if (err) console.log(err)
      console.log(`MySQL Database connected with host: ${conn.config.host}`)
      pool.releaseConnection(conn)
    })

    this.pool = pool
  }

  query(...args) {
    const query = this.pool.query(...args)
    if (process.env.NODE_ENV === "development") {
      let id = getReqId()
      let now = getDateTimeNow()
      const type = formatColor("SQL ", "purple")
      let { sql } = query
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
      stack = stack.join(",")
      console.log(`${id}|${now}|${type}|${sql}|${stack}`)
    }
    return query
  }
}

export default new MySqlDatabase()
