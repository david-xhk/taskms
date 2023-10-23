import React from "react"
import Button from "react-bootstrap/Button"
import ButtonGroup from "react-bootstrap/ButtonGroup"
import ButtonToolbar from "react-bootstrap/ButtonToolbar"
import { useLocation, useNavigate } from "react-router-dom"

function Header(props) {
  const { title, children } = props
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-1 mb-2">
      {title && <Header.Title title={title} />}
      {children}
    </div>
  )
}

Header.Title = function HeaderTitle(props) {
  const { title, children } = props
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <h4 className="text-nowrap mb-0 me-2">
      {location.key !== "default" && <Header.Button icon="fas fa-arrow-left" variant="link-dark" className="align-baseline me-1" onClick={() => navigate(-1)} />}
      {title ?? children}
    </h4>
  )
}

Header.ButtonToolbar = function HeaderButtonToolbar(props) {
  const { children, className, ...restProps } = props
  const classes = ["flex-grow-1 justify-content-between gap-1"]
  if (className) {
    classes.push(className)
  }

  return (
    <ButtonToolbar className={classes.join(" ")} {...restProps}>
      {children}
    </ButtonToolbar>
  )
}

Header.ButtonGroup = function HeaderButtonGroup(props) {
  const { children, ...restProps } = props
  return <ButtonGroup {...restProps}>{children}</ButtonGroup>
}

Header.Button = function HeaderButton(props) {
  const { name, icon, className, children, variant = "light", ...restProps } = props
  const classes = ["icon-link text-no-wrap flex-grow-0"]
  if (className) {
    classes.push(className)
  }
  return (
    <Button size="sm" variant={variant} className={classes.join(" ")} {...restProps}>
      <i className={icon} />
      {name ?? children}
    </Button>
  )
}

export default Header
