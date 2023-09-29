import React from "react"

export default function NotLoggedIn({ page }) {
  return (
    <div>
      <div className="text-center">
        <h2 className="mb-4">Oops, you are not logged in.</h2>
        <p className="lead text-muted">Please log in at the Header to access this page. If you don&lsquo;t have an account, please contact the administrator and ask them to create an account for you.</p>
      </div>
      {page && <div style={{ minHeight: "50vh" }} />}
    </div>
  )
}
