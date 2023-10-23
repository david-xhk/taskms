import { useCallback, useContext, useEffect } from "react"

import useInsertionCallback from "src/hooks/useInsertionCallback"

import EventEmitterContext from "./EventEmitterContext"

/**
 * @param {object} [args]
 * @param {string} [args.name]
 * @param {{ [event: string]: Function | Function[] }} [args.on]
 * @returns {import("./EventEmitterContext").EventEmitter & { cancelAll: (reason?: string) => void; onCancel: (callback: Function) => void; }}
 */
export default function useEventEmitter(args) {
  const { name = "app", on: initialListeners = {} } = args ?? {}
  const { on, emit } = useContext(EventEmitterContext)

  const addInitialListeners = useInsertionCallback(
    /** @param {string} [event] */ event => {
      if (typeof initialListeners !== "object") {
        return
      }
      if (event === undefined) {
        for (let [event, callbacks] of Object.entries(initialListeners)) {
          for (let callback of Array.isArray(callbacks) ? callbacks : [callbacks]) {
            on(`${name} ${event}`, callback)
          }
        }
      } else if (event in initialListeners) {
        const callbacks = initialListeners[event]
        for (let callback of Array.isArray(callbacks) ? callbacks : [callbacks]) {
          on(`${name} ${event}`, callback)
        }
      }
    }
  )

  const onUnmount = useInsertionCallback(() => emit(`${name} cancel`, "unmounted"))

  useEffect(() => {
    addInitialListeners()
    return onUnmount
  }, [addInitialListeners, onUnmount])

  return {
    emit: useCallback(
      (event, ...args) => {
        emit(`${name} ${event}`, ...args)
        addInitialListeners(event)
      },
      [name, emit, addInitialListeners]
    ),
    on: useCallback((event, callback) => on(`${name} ${event}`, callback), [name, on]),
    cancelAll: useCallback((reason = "cancelled") => emit(`${name} cancel`, reason), [name, emit]),
    onCancel: useCallback(callback => on(`${name} cancel`, callback), [name, on])
  }
}
