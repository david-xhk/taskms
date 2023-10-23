import React from "react"
import { Link } from "react-router-dom"

import Page from "./Page"

export default function NotAuthorizedPage() {
  return (
    <Page title="Not Authorized">
      <h4 className="mb-3">
        <strong>Oops</strong>, you are not authorized to access this page.
      </h4>
      <p className="lead text-muted">
        If you believe this is an error, please contact the administrator or go back to the <Link to="/">homepage</Link>.
      </p>
    </Page>
  )
}
