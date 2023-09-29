import { colorWords, formatColor } from "@han-keong/tms-helpers/stringHelper"

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
    case "PATCH":
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
