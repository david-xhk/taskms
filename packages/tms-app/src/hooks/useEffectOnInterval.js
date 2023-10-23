import { useEffect } from "react"

import useInsertionCallback from "./useInsertionCallback"

/**
 * @param {() => void} effect
 * @param {number} ms
 */
export default function useEffectOnInterval(effect, ms) {
  const onInterval = useInsertionCallback(effect)
  useEffect(() => {
    const interval = setInterval(() => onInterval(), ms)
    return () => clearInterval(interval)
  }, [onInterval, ms])
}
