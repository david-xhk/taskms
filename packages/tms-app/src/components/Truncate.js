import React from "react"

import { truncate } from "@han-keong/tms-helpers/stringHelper"

export default function Truncate(props) {
  const { length = 25, text, maxLength = 1000, className, ...restProps } = props

  const classes = ["d-block w-100"]
  if (className) {
    classes.push(className)
  }

  let actualText = text
  if (text.length > length) {
    restProps["data-tooltip-content"] = truncate(text, maxLength)
    restProps["data-tooltip-id"] = "my-tooltip"
    actualText = truncate(text, length)
    classes.push("text-truncate")
  }

  return (
    <span className={classes.join(" ")} {...restProps}>
      {actualText}
    </span>
  )
}
