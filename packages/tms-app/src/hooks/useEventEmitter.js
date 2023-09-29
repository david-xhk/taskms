import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react"

import log from "../log.js"

export const EventEmitterContext = createContext({
  /** @type {(event: string, ...args) => void} */
  emit: () => {},

  /** @type {(event: string, callback: Function) => void} */
  on: () => {}
})

export function EventEmitterProvider({ children }) {
  const listeners = useRef({})

  const emit = useCallback(function emit(event, ...args) {
    if (process.env.NODE_ENV === "development") {
      log(event, ...args)
    }
    listeners.current[event]?.forEach(callback => callback(...args))
    listeners.current[event] = []
  }, [])

  const on = useCallback(function on(event, callback) {
    if (!(event in listeners.current)) {
      listeners.current[event] = []
    }
    listeners.current[event].push(callback)
    return callback
  }, [])

  return <EventEmitterContext.Provider value={{ emit, on }}>{children}</EventEmitterContext.Provider>
}

export default function useEventEmitter(name = "app") {
  const { emit, on } = useContext(EventEmitterContext)

  useEffect(() => {
    return () => emit(`${name} cancel`)
  }, [])

  const emitter = useMemo(
    () => ({
      emit(event, ...args) {
        emit(`${name} ${event}`, ...args)
      },

      on(event, callback) {
        return on(`${name} ${event}`, callback)
      },

      cancelAll() {
        emit(`${name} cancel`)
      },

      onCancel(callback) {
        return on(`${name} cancel`, callback)
      }
    }),
    [name]
  )

  return emitter
}
