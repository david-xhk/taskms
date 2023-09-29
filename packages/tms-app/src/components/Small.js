import React from "react"
import { CSSTransition } from "react-transition-group"

export default function Small(props) {
  let className = "fade-transition"
  if (props.className) {
    className = `${props.className} ${className}`
  }
  return (
    <CSSTransition in={props.visible} timeout={200} classNames="fade-transition" unmountOnExit>
      <small className={className}>{props.children}</small>
    </CSSTransition>
  )
}
