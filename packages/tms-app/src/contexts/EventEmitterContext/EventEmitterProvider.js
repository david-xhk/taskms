import React, { useCallback, useRef } from "react"

import config from "src/config"

import EventEmitterContext from "./EventEmitterContext"

/** @typedef {import("./EventEmitterContext").EventEmitter} EventEmitter */

export default function EventEmitterProvider({ children }) {
  const listeners = useRef(/** @type {{ [event: string]: Function[] }} */ ({}))

  /** @type {EventEmitter["emit"]} */
  const emit = useCallback((event, ...args) => {
    if (config.NODE_ENV === "development") {
      console.log("tms", event, ...args)
    }
    listeners.current[event]?.forEach(callback => callback(...args))
    listeners.current[event] = []
  }, [])

  /** @type {EventEmitter["on"]} */
  const on = useCallback((event, callback) => {
    if (!(event in listeners.current)) {
      listeners.current[event] = []
    }
    listeners.current[event].push(callback)
  }, [])

  return <EventEmitterContext.Provider value={{ emit, on }}>{children}</EventEmitterContext.Provider>
}
