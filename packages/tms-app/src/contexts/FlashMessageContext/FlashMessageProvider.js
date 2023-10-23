import React, { useRef } from "react"

import FlashMessageContext from "./FlashMessageContext"

export default function FlashMessageProvider({ children }) {
  const alertsRef = useRef(/** @type {HTMLDivElement?} */ (null))

  return (
    <FlashMessageContext.Provider value={alertsRef}>
      <div className="floating-alerts" ref={alertsRef} />
      {children}
    </FlashMessageContext.Provider>
  )
}
