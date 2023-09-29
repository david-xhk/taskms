import React from "react"

import NotFound from "../components/NotFound.js"
import Page from "./Page.js"

export default function NotFoundPage() {
  return (
    <Page title="Not Found">
      <NotFound page />
    </Page>
  )
}
