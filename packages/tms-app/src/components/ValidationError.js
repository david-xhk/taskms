import React from "react"
import { CSSTransition } from "react-transition-group"

export default function ValidationError(props) {
  const { children, offset, style, visible } = props

  const styles = {}
  if (style) {
    Object.assign(styles, style)
  }
  if (offset) {
    styles.bottom = `calc(100% - ${offset})`
  } else {
    styles.bottom = "100%"
  }

  return (
    <CSSTransition in={visible} timeout={330} classNames="slide-up-transition" unmountOnExit>
      <div className="alert alert-danger small validation-error slide-up-transition" style={styles}>
        {children}
      </div>
    </CSSTransition>
  )
}
