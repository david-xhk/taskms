import React from "react"
import { Link } from "react-router-dom"

import Page from "./Page"

export default function NotFoundPage() {
  return (
    <Page title="Not Found">
      <h4 className="mb-3">
        <strong>Whoops</strong>, we cannot find that page.
      </h4>
      <p className="lead text-muted">
        You can always visit the <Link to="/">homepage</Link> to get a fresh start.
      </p>
    </Page>
  )
}
