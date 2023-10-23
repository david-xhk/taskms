/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"

import config from "src/config"

import useEffectOnFocus from "./useEffectOnFocus"
import useEffectOnInterval from "./useEffectOnInterval"
import useInsertionCallback from "./useInsertionCallback"

/**
 * @param {() => void} effect
 * @param {any[]} [deps]
 */
export default function useEffectOnSync(effect, deps) {
  const [state, setState] = useState(/** @type {"ready" | "done" | "skip" | "skipped"} */ ("ready"))

  const callback = useInsertionCallback(effect)

  function invokeWhenReady() {
    if (state === "ready") {
      callback()
      setState("done")
    }
  }

  function invokeThenSkip() {
    if (state === "ready") {
      return
    }
    callback()
    setState("skip")
  }

  function resetState() {
    if (state === "skip") {
      setState("skipped")
    } else {
      setState("ready")
    }
  }

  useEffect(invokeWhenReady, [state])

  useEffect(invokeThenSkip, deps ?? [])

  useEffectOnFocus(invokeThenSkip)

  useEffectOnInterval(resetState, config.SYNC_INTERVAL_MS)
}
