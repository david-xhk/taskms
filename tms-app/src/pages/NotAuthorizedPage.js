import React from "react"

import NotAuthorized from "../components/NotAuthorized"
import Page from "./Page"

export default function NotAuthorizedPage() {
  return (
    <Page title="Not Authorized">
      <NotAuthorized page />
    </Page>
  )
}
