import { useCallback, useInsertionEffect, useRef } from "react"

/**
 * @template {(...args: any[]) => any} F
 * @param {F} fn
 * @returns {(...args: Parameters<F>) => ReturnType<F>}
 */
export default function useInsertionCallback(fn) {
  const ref = useRef(fn)
  useInsertionEffect(() => {
    ref.current = fn
  }, [fn])
  return useCallback((...args) => ref.current(...args), [])
}
