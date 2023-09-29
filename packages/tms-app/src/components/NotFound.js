import React from "react"
import { Link } from "react-router-dom"

export default function NotFound({ page }) {
  return (
    <div>
      <div className="text-center">
        <h2 className="mb-4">Whoops, we cannot find that page.</h2>
        <p className="lead text-muted">
          You can always visit the <Link to="/">homepage</Link> to get a fresh start.
        </p>
      </div>
      {page && <div style={{ minHeight: "50vh" }} />}
    </div>
  )
}
