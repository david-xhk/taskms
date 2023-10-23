import React from "react"

import Page from "./Page"

export default function NotLoggedInPage() {
  return (
    <Page title="Login">
      <h4 className="mb-3">
        You are not <strong>logged in</strong>.
      </h4>
      <p className="lead text-muted">Please log in at the Header to access this page. If you don&lsquo;t have an account, please contact the administrator and ask them to create an account for you.</p>
    </Page>
  )
}
