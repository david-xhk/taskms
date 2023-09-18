import React from "react"

import LoadingDots from "../components/LoadingDots"
import Page from "./Page"

export default function LoadingDotsPage(props) {
  return (
    <Page {...props}>
      <LoadingDots page />
    </Page>
  )
}
