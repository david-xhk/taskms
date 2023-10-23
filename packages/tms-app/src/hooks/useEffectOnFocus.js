import { useEffect } from "react"

import useInsertionCallback from "./useInsertionCallback"

/**
 * @param {() => void} effect
 */
export default function useEffectOnFocus(effect) {
  const onFocus = useInsertionCallback(effect)
  useEffect(() => {
    window.addEventListener("focus", onFocus)
    return () => window.removeEventListener("focus", onFocus)
  }, [onFocus])
}
