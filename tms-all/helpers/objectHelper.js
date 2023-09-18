import { parseOrCreateArray } from "./parseHelper.js"

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

export function hasValue(obj, key) {
  if (obj === undefined) {
    return false
  }
  return key in obj
}

export function getValue(obj, key, fallback) {
  const keys = parseOrCreateArray(key, ".")
  let curr = obj
  for (let key of keys.slice(0, -1)) {
    if (!hasValue(curr, key)) {
      return fallback
    }
    curr = curr[key]
  }
  return curr[keys.at(-1)] ?? fallback
}

export function setValue(obj, key, value) {
  const keys = parseOrCreateArray(key, ".")
  let curr = obj
  for (let key of keys.slice(0, -1)) {
    if (!hasValue(curr, key)) {
      curr[key] = {}
    }
    curr = curr[key]
  }
  curr[keys.at(-1)] = value
}

export function deleteValue(obj, key) {
  const keys = parseOrCreateArray(key, ".")
  let curr = obj
  const steps = []
  for (let key of keys.slice(0, -1)) {
    if (!hasValue(curr, key)) {
      return
    }
    steps.push([curr, curr[key], key])
    curr = curr[key]
  }
  delete curr[keys.at(-1)]
  for (let [parent, child, key] of steps.reverse()) {
    if (Object.keys(child).length > 0) {
      break
    }
    delete parent[key]
  }
}

export const incrementValue = (obj, key) => setValue(obj, key, getValue(obj, key, 0) + 1)

export const decrementValue = (obj, key) => setValue(obj, key, getValue(obj, key, 0) - 1)

export const pushValue = (obj, key, value) => setValue(obj, key, getValue(obj, key, []).concat([value]))
