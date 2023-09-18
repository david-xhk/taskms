import React, { createContext, useCallback, useContext, useRef } from "react"

export const FlashMessageContext = createContext()

export function FlashMessageProvider(props) {
  const alertsRef = useRef(null)

  return (
    <FlashMessageContext.Provider value={alertsRef}>
      <div className="floating-alerts" ref={alertsRef} />
      {props.children}
    </FlashMessageContext.Provider>
  )
}

export default function useFlashMessage() {
  const alertsRef = useContext(FlashMessageContext)

  const flashMessage = useCallback((message, alertType) => {
    if (!alertsRef.current) {
      return
    }
    const element = document.createElement("div")
    element.className = `alert alert-${alertType} text-center floating-alert shadow-sm`
    element.innerText = message
    if (alertsRef.current.childNodes.length === 0) {
      alertsRef.current.appendChild(element)
    } else {
      alertsRef.current.replaceChild(element, alertsRef.current.childNodes[0])
    }
    element.scrollIntoView()
  }, [])

  return flashMessage
}
