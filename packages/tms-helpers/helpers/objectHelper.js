import { parseOrCreateArray } from "./parseHelper.js"

/**
 * @param {{ [key: string]: number }} obj
 */
export function getMaxKeys(obj) {
  const keys = Object.keys(obj)
  let ans = [keys[0]]
  for (let key of keys.slice(1)) {
    if (obj[key] > obj[ans[0]]) {
      ans = [key]
    } else if (obj[key] === obj[ans[0]]) {
      ans.push(key)
    }
  }
  return ans
}

/**
 * @typedef {{ [key: string]: Obj | any }} Obj
 */

/**
 * @param {Obj} obj
 * @param {string | string[]} key
 */
export function hasValue(obj, key) {
  if (obj === undefined) {
    return false
  }
  const keys = parseOrCreateArray(key, ".")
  if (keys.length === 0) {
    return false
  }
  const last = /** @type {string} */ (keys.pop())
  let curr = obj
  for (let key of keys) {
    if (!(key in curr)) {
      return false
    }
    curr = /** @type {Obj} */ (curr[key])
  }
  return last in curr
}

/**
 * @param {Obj} obj
 * @param {string | string[]} key
 * @param {any} [fallback]
 */
export function getValue(obj, key, fallback) {
  const keys = parseOrCreateArray(key, ".")
  if (keys.length === 0) {
    return fallback
  }
  const last = /** @type {string} */ (keys.pop())
  let curr = obj
  for (let key of keys) {
    if (!(key in curr)) {
      return fallback
    }
    curr = /** @type {Obj} */ (curr[key])
  }
  if (last in curr) {
    return /** @type {any} */ (curr[last])
  } else {
    return fallback
  }
}

/**
 * @param {Obj} obj
 * @param {string | string[]} key
 * @param {any} value
 */
export function setValue(obj, key, value) {
  if (obj === undefined) {
    return
  }
  const keys = parseOrCreateArray(key, ".")
  if (keys.length === 0) {
    return
  }
  const last = /** @type {string} */ (keys.pop())
  let curr = obj
  for (let key of keys) {
    if (!(key in curr)) {
      curr[key] = {}
    }
    curr = /** @type {Obj} */ (curr[key])
  }
  curr[last] = value
}

/**
 * @param {Obj} obj
 * @param {string | string[]} key
 */
export function deleteValue(obj, key) {
  if (obj === undefined) {
    return
  }
  const keys = parseOrCreateArray(key, ".")
  if (keys.length === 0) {
    return
  }
  const last = /** @type {string} */ (keys.pop())
  let curr = obj
  let next = curr
  const steps = /** @type {[Obj, Obj, string][]} */ ([])
  for (let key of keys.slice(0, -1)) {
    if (!(key in curr)) {
      return
    }
    next = /** @type {Obj} */ (curr[key])
    steps.push([curr, next, key])
    curr = next
  }
  delete curr[last]
  for (let [parent, child, key] of steps.reverse()) {
    if (Object.keys(child).length === 0) {
      delete parent[key]
    } else {
      break
    }
  }
}

/**
 * @param {Obj} obj
 * @param {string | string[]} key
 */
export function incrementValue(obj, key) {
  const value = getValue(obj, key, 0)
  setValue(obj, key, value + 1)
}

/**
 * @param {Obj} obj
 * @param {string | string[]} key
 */
export function decrementValue(obj, key) {
  const value = getValue(obj, key, 0)
  setValue(obj, key, value - 1)
}

/**
 * @param {Obj} obj
 * @param {string | string[]} key
 */
export function pushValue(obj, key, value) {
  const values = getValue(obj, key, [])
  setValue(obj, key, values.concat(value))
}
