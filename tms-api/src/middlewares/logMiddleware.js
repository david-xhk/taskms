export function logRequest(req, res, next) {
  const id = getNextReqId()
  const now = getDateTimeNow()
  const type = formatColor("HTTP", "purple")
  let target = `${req.method} ${req.originalUrl}`
  switch (req.method) {
    case "GET":
      target = colorWords(target, "green", 2)
      break
    case "POST":
      target = colorWords(target, "yellow", 2)
      break
    case "PUT":
      target = colorWords(target, "blue", 2)
      break
    case "DELETE":
      target = colorWords(target, "red", 2)
      break
  }
  let { ip } = req
  let message = `${id}|${now}|${type}|${target}|${ip}`
  console.log(message)
  next()
}

let reqId = 0

export function getReqId() {
  return formatColor(reqId, "cyan")
}

export function getNextReqId() {
  return formatColor(++reqId, "cyan")
}

export function getDateTimeNow() {
  const dateTime = new Date(Date.now()).toLocaleString()
  return formatColor(dateTime, "yellow")
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
