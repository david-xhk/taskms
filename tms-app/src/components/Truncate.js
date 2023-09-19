import React from "react"
import { Tooltip } from "react-tooltip"

import { truncate } from "@han-keong/helpers"

export default function Truncate(props) {
  const { length, text } = props
  if (text.length <= length) {
    return <span>{text}</span>
  }
  const truncated = truncate(text, length)
  return (
    <>
      <span data-tooltip-content={text} data-tooltip-id={`${truncated}-tooltip`}>
        {truncated}
      </span>
      <Tooltip place="bottom" id={`${truncated}-tooltip`} className="custom-tooltip" />
    </>
  )
}
