import React from "react"
import { CSSTransition } from "react-transition-group"

export default function ValidationError(props) {
  return (
    <CSSTransition in={props.visible} timeout={330} classNames="slide-up-transition" unmountOnExit>
      <div className="alert alert-danger small slide-up-transition">{props.children}</div>
    </CSSTransition>
  )
}
