import { useEffect } from "react"

import useInsertionCallback from "./useInsertionCallback"

export default function useEffectOnClickOutside(ref, callback) {
  const handleClickOutside = useInsertionCallback(event => {
    if (ref.current && !ref.current.contains(event.target)) {
      callback()
    }
  })
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [handleClickOutside])
}
