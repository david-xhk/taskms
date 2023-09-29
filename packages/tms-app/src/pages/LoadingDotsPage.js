import React from "react"

import LoadingDots from "../components/LoadingDots.js"
import Page from "./Page.js"

export default function LoadingDotsPage(props) {
  return (
    <Page {...props}>
      <LoadingDots page />
    </Page>
  )
}
