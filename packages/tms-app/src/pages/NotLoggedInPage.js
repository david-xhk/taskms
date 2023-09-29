import React from "react"

import NotLoggedIn from "../components/NotLoggedIn.js"
import Page from "./Page.js"

export default function NotLoggedInPage() {
  return (
    <Page title="Login">
      <NotLoggedIn page />
    </Page>
  )
}
