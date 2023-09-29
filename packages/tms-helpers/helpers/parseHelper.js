/**
 * @param {string} input
 */
export function parseInteger(input) {
  if (typeof input === "number") {
    return input
  }
  if (/^[0-9]+$/.test(input)) {
    return Number.parseInt(input)
  }
  return null
}

/**
 * @param {string} input
 */
export function parseNumber(input) {
  if (/^[+-]?([0-9]*[.])?[0-9]+$/.test(input)) {
    return Number.parseInt(input)
  }
  return null
}

/**
 * @param {string} input
 */
export function parseBoolean(input) {
  if (/^true$|^1$|^yes$/i.test(input)) {
    return true
  }
  if (/^false$|^0$|^no$/i.test(input)) {
    return false
  }
  return null
}

/**
 * @param {string | string[]} input
 * @param {string} [sep]
 */
export function parseArray(input, sep = ",") {
  if (Array.isArray(input)) {
    return input
  }
  if (typeof input === "string") {
    if (/^\[.*\]$/.test(input)) {
      input = input.replace(/^\[|\]$/g, "")
    }
    const pattern = new RegExp(`^(\\s*[^\\${sep}]+\\s*\\${sep}\\s*)*[^\\${sep}]+\\s*$`)
    if (pattern.test(input)) {
      return input.split(sep).map(str => str.trim())
    }
  }
  return null
}

/**
 * @param {string | string[]} [input]
 * @param {string} [sep]
 */
export function parseOrCreateArray(input, sep = ",") {
  if (!input) {
    return []
  }
  let result = parseArray(input, sep)
  if (result === null) {
    return [/** @type {string} */ (input)]
  } else {
    return [...result]
  }
}

/**
 * @param {string} input
 */
export function parseDate(input) {
  return new Date(Date.parse(input))
}
