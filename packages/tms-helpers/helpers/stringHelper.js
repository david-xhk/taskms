/**
 * @param {string} str
 */
export function capitalize(str) {
  return str && str[0].toUpperCase() + str.slice(1)
}

/**
 * @param {string} str
 */
export function uncapitalize(str) {
  return str && str[0].toLowerCase() + str.slice(1)
}

/**
 * @param {string} str
 */
export function sentencify(str) {
  return capitalize(str).replace(/\.*$/, "") + "."
}

/**
 * @param {string} str
 */
export function unsentencify(str) {
  return uncapitalize(str).replace(/\.*$/, "")
}

/**
 * @param {string} str
 * @param {number} len
 */
export function truncate(str, len) {
  if (str.length <= len) {
    return str
  }
  return str.slice(0, len - 3) + "..."
}

/**
 * @param {string[]} arr
 * @param {string} sep
 * @param {string} [lastSep]
 */
export function join(arr, sep, lastSep) {
  if (arr.length === 1) {
    return arr[0]
  }
  if (!lastSep) {
    return arr.join(sep)
  }
  const last = arr.pop()
  return arr.join(sep) + lastSep + last
}

/**
 * @param {string} str
 * @param {"red" | "green" | "yellow" | "blue" | "purple" | "cyan"} color
 * @link https://www.codeproject.com/Tips/5255355/How-to-Put-Color-on-Windows-Console
 */
export function formatColor(str, color) {
  switch (color) {
    case "red":
      return "\x1b[31m" + str + "\x1b[0m"
    case "green":
      return "\x1b[32m" + str + "\x1b[0m"
    case "yellow":
      return "\x1b[33m" + str + "\x1b[0m"
    case "blue":
      return "\x1b[34m" + str + "\x1b[0m"
    case "purple":
      return "\x1b[35m" + str + "\x1b[0m"
    case "cyan":
      return "\x1b[36m" + str + "\x1b[0m"
    default:
      return str
  }
}

/**
 * @param {string} str
 * @param {"red" | "green" | "yellow" | "blue" | "purple" | "cyan"} color
 * @param {number} [n=2]
 */
export function colorWords(str, color, n = 2) {
  let words = str.split(" ")
  let colored = words
    .slice(0, n)
    .map(word => formatColor(word, color))
    .join(" ")
  let uncolored = words.slice(n).join(" ")
  if (uncolored) {
    return `${colored} ${uncolored}`
  } else {
    return colored
  }
}
