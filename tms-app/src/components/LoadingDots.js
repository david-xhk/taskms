import React from "react"

export default function LoadingDots({ page }) {
  return (
    <div>
      <div className="centered-overlay">
        <div className="dots-loading">
          <div></div>
        </div>
      </div>
      {page && <div style={{ minHeight: "50vh" }} />}
    </div>
  )
}
