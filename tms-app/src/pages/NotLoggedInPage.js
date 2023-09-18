import React from "react"

import NotLoggedIn from "../components/NotLoggedIn"
import Page from "./Page"

export default function NotLoggedInPage() {
  return (
    <Page title="Login">
      <NotLoggedIn page />
    </Page>
  )
}
