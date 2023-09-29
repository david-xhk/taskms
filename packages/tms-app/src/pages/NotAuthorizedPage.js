import React from "react"

import NotAuthorized from "../components/NotAuthorized.js"
import Page from "./Page.js"

export default function NotAuthorizedPage() {
  return (
    <Page title="Not Authorized">
      <NotAuthorized page />
    </Page>
  )
}
