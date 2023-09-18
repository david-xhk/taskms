export function parseInteger(input) {
  if (input === undefined) {
    return undefined
  }
  if (/^[0-9]+$/.test(input)) {
    return Number.parseInt(input)
  }
  return null
}

export function parseNumber(input) {
  if (input === undefined) {
    return undefined
  }
  if (/^[+-]?([0-9]*[.])?[0-9]+$/.test(input)) {
    return Number.parseInt(input)
  }
  return null
}

export function parseBoolean(input) {
  if (input === undefined) {
    return undefined
  }
  if (/^true$|^1$|^yes$/i.test(input)) {
    return true
  }
  if (/^false$|^0$|^no$/i.test(input)) {
    return false
  }
  return null
}

export function parseArray(input, sep = ",") {
  if (input === undefined) {
    return undefined
  }
  if (Array.isArray(input)) {
    return input
  }
  if (/^\[.*\]$/.test(input)) {
    input = input.replace(/^\[|\]$/g, "")
  }
  const pattern = new RegExp(`^([^\\${sep}]+\\${sep})+[^\\${sep}]+$`)
  if (pattern.test(input)) {
    return input.split(sep)
  }
  return null
}

export function parseOrCreateArray(input, sep) {
  let result = parseArray(input, sep)
  if (result === undefined) {
    return []
  } else if (result === null) {
    return [input]
  } else {
    return result
  }
}
