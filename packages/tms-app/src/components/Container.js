import React from "react"

export default function Container(props) {
  const { fluid, py, children, className, ...restProps } = props
  const classes = []
  if (className) {
    classes.push(className)
  }
  classes.push(`container${fluid ? "-fluid" : ""}`)
  classes.push("position-relative")
  if (py !== false) {
    classes.push(`py-${py ?? 4}`)
  }

  return (
    <div className={classes.join(" ")} {...restProps}>
      {children}
    </div>
  )
}
