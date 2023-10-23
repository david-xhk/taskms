import React from "react"
import { CSSTransition } from "react-transition-group"

export default function Small(props) {
  const { className } = props

  const classes = ["fade-transition"]
  if (className) {
    classes.push(className)
  }

  return (
    <CSSTransition in={props.visible ?? true} timeout={200} classNames="fade-transition" unmountOnExit>
      <small className={classes.join(" ")}>{props.children}</small>
    </CSSTransition>
  )
}
