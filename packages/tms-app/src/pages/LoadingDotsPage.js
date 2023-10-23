import React from "react"

import Page from "./Page"

export default function LoadingDotsPage(props) {
  return (
    <Page {...props}>
      <div className="centered-overlay">
        <div className="dots-loading">
          <div></div>
        </div>
      </div>
    </Page>
  )
}
