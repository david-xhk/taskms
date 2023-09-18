import React, { useEffect } from "react"

import Container from "../components/Container"

export default function Page(props) {
  const { title, children, ...restProps } = props

  useEffect(() => {
    document.title = title ? `${title} | TMS` : "TMS"
    window.scrollTo(0, 0)
  }, [title])

  return <Container {...restProps}>{children}</Container>
}
