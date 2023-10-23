import { useCallback, useContext } from "react"

import FlashMessageContext from "./FlashMessageContext"

/**
 * @callback FlashMessageFunction
 * @param {string} message
 * @param {"primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark"} alertType
 */

/** @returns {FlashMessageFunction} */
export default function useFlashMessage() {
  const alertsRef = useContext(FlashMessageContext)

  return useCallback(
    (message, alertType) => {
      if (!alertsRef?.current) {
        return
      }
      const element = document.createElement("div")
      element.className = `alert alert-${alertType} text-center floating-alert shadow-sm`
      element.innerText = message
      element.onclick = () => alertsRef.current?.removeChild(element)
      if (alertsRef.current.childNodes.length === 0) {
        alertsRef.current.appendChild(element)
      } else {
        alertsRef.current.replaceChild(element, alertsRef?.current.childNodes[0])
      }
    },
    [alertsRef]
  )
}
