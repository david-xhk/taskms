import React from "react"
import { Link } from "react-router-dom"

export default function NotAuthorized({ page }) {
  return (
    <div>
      <div className="text-center">
        <h2 className="mb-4">Oops, you are not authorized to access this page.</h2>
        <p className="lead text-muted">
          If you believe this is an error, please contact the administrator or go back to the <Link to="/">homepage</Link>.
        </p>
      </div>
      {page && <div style={{ minHeight: "50vh" }} />}
    </div>
  )
}
