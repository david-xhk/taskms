import React, { useEffect } from "react"
import Container from "react-bootstrap/Container"

export default function Page(props) {
  const { children, className, title, style, ...restProps } = props

  const classes = ["d-flex flex-column pt-3"]
  if (className) {
    classes.push(className)
  }

  const styles = { flex: 1, minHeight: "calc(100vh - 133px)" }
  if (style) {
    Object.assign(styles, style)
  }

  useEffect(() => {
    document.title = title ? `${title} | TMS` : "TMS"
    window.scrollTo(0, 0)
  }, [title])

  return (
    <Container fluid className={classes.join(" ")} style={styles} {...restProps}>
      {children}
    </Container>
  )
}
