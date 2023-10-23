import { parseDate } from "./parseHelper.js"

export function toYYYYMMDDDate(date) {
  date = parseDate(date)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().substring(0, 10)
}

export function getDateTimeString(date) {
  date = parseDate(date)
  const today = new Date()
  let timeDiff = today.getTime() - date.getTime()
  const result = []
  const months = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 31))
  timeDiff %= 1000 * 60 * 60 * 24 * 31
  if (months === 1) {
    result.push("A month")
  } else if (months > 1) {
    result.push(`${months} months`)
  }
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  if (months > 0) {
    if (days === 1) {
      result[result.length - 1] += " and a day"
    } else if (days > 1) {
      result[result.length - 1] += `, ${days} days`
    }
  } else if (days === 0) {
    result.push("Today")
  } else if (days === 1) {
    result.push("Yesterday")
  } else {
    result.push(`${days} days`)
  }
  if (months > 0 || days > 1) {
    result[result.length - 1] += " ago"
  } else {
    const timeString = date.toLocaleTimeString("en-SG", { hour12: true, hour: "numeric", minute: "2-digit" })
    result[result.length - 1] += `, at ${timeString}`
  }
  return result.join(" ")
}
