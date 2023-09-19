export function logRequest(req, res, next) {
  const type = formatColor("HTTP", "purple")
  let line = `${req.method} ${req.originalUrl}`
  switch (req.method) {
    case "GET":
      line = colorWords(line, "green", 2)
      break
    case "POST":
      line = colorWords(line, "yellow", 2)
      break
    case "PUT":
      line = colorWords(line, "blue", 2)
      break
    case "DELETE":
      line = colorWords(line, "red", 2)
      break
  }
  const { ip } = req
  console.log(`${type}|${line}|${ip}`)
  next()
}

// Reference: https://www.codeproject.com/Tips/5255355/How-to-Put-Color-on-Windows-Console
export function formatColor(message, color) {
  switch (color) {
    case "red":
      return "\x1b[31m" + message + "\x1b[0m"
    case "green":
      return "\x1b[32m" + message + "\x1b[0m"
    case "yellow":
      return "\x1b[33m" + message + "\x1b[0m"
    case "blue":
      return "\x1b[34m" + message + "\x1b[0m"
    case "purple":
      return "\x1b[35m" + message + "\x1b[0m"
    case "cyan":
      return "\x1b[36m" + message + "\x1b[0m"
    default:
      return message
  }
}

export function colorWords(message, color, n = 2) {
  let words = message.split(" ")
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
