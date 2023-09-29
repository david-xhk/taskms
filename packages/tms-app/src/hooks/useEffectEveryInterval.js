import { useEffect } from "react"

export default function useEffectEveryInterval(effect, ms) {
  useEffect(() => {
    const interval = setInterval(() => effect(), ms)
    return () => clearInterval(interval)
  }, [])
}
