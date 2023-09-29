import { parseOrCreateArray } from "./parseHelper.js"

/**
 * @param {string} table
 * @param {string | string[]} [columns]
 * @param {string} [values]
 */
export function insertSql(table, columns, values) {
  const sql = ["INSERT INTO", table]
  if (columns !== undefined) {
    sql.push("(" + parseOrCreateArray(columns).join(", ") + ")")
  }
  sql.push("VALUES", values ?? "?")
  return sql.join(" ") + ";"
}

/**
 * @param {string} table
 * @param {object} [options]
 * @param {string | string[]} [options.columns]
 * @param {string} [options.join]
 * @param {string} [options.on]
 * @param {string} [options.where]
 * @param {string} [options.groupBy]
 * @param {string} [options.having]
 * @param {string | number} [options.limit]
 * @param {string | number} [options.offset]
 */
export function selectSql(table, options) {
  let { columns, join, on, where, groupBy, having, limit, offset } = options ?? {}
  if (columns !== undefined) {
    columns = parseOrCreateArray(columns).join(", ")
  }
  const sql = ["SELECT", columns || "*", "FROM", table]
  if (join !== undefined && on !== undefined) {
    sql.push("JOIN", join, "ON", on)
  }
  if (where !== undefined) {
    sql.push("WHERE", where)
  }
  if (groupBy !== undefined) {
    sql.push("GROUP BY", groupBy)
    if (having !== undefined) {
      sql.push("HAVING", having)
    }
  }
  if (limit !== undefined) {
    sql.push("LIMIT", limit.toString())
    if (offset !== undefined) {
      sql.push("OFFSET", offset.toString())
    }
  }
  return sql.join(" ") + ";"
}

/**
 * @param {string} table
 * @param {string} where
 */
export function selectExistsSql(table, where) {
  const inner = ["SELECT 1 FROM", table, "WHERE", where]
  const sql = ["SELECT EXISTS", "(" + inner.join(" ") + ")", "AS `exists`"]
  return sql.join(" ") + ";"
}

/**
 * @param {string} table
 * @param {string} where
 */
export function selectNotExistsSql(table, where) {
  const inner = ["SELECT 1 FROM", table, "WHERE", where]
  const sql = ["SELECT NOT EXISTS", "(" + inner.join(" ") + ")", "AS `notExists`"]
  return sql.join(" ") + ";"
}

/**
 * @param {string} table
 * @param {string | string[]} columns
 * @param {string} where
 */
export function updateSql(table, columns, where) {
  const assignments = parseOrCreateArray(columns).map(column => column + " = ?")
  const sql = ["UPDATE", table, "SET", assignments.join(", "), "WHERE", where]
  return sql.join(" ") + ";"
}

/**
 * @param {string} table
 * @param {string} where
 */
export function deleteSql(table, where) {
  const sql = ["DELETE FROM", table, "WHERE", where]
  return sql.join(" ") + ";"
}
