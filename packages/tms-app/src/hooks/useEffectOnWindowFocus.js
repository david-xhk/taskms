import { useEffect } from "react"

export default function useEffectOnWindowFocus(effect, deps) {
  useEffect(() => {
    const onFocus = () => effect()
    window.addEventListener("focus", onFocus)
    return () => window.removeEventListener("focus", onFocus)
  }, deps)
}
