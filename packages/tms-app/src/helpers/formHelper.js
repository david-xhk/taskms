import { toYYYYMMDDDate } from "@han-keong/tms-helpers/dateHelper"

export function onDateInputFocus(event) {
  event.currentTarget.setAttribute("type", "date")
  const value = event.currentTarget.getAttribute("value")
  if (value) {
    event.currentTarget.setAttribute("value", toYYYYMMDDDate(value))
  }
}
