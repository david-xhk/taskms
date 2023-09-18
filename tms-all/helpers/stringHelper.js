export function capitalize(str) {
  return str && str[0].toUpperCase() + str.slice(1)
}

export function uncapitalize(str) {
  return str && str[0].toLowerCase() + str.slice(1)
}

export function sentencify(str) {
  return capitalize(str).replace(/\.*$/, "") + "."
}

export function unsentencify(str) {
  return uncapitalize(str).replace(/\.*$/, "")
}

export function truncate(str, len) {
  if (str.length <= len) {
    return str
  }
  return str.slice(0, len - 3) + "..."
}
