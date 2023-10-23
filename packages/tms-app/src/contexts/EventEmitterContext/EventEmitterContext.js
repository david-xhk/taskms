import { createContext } from "react"

/**
 * @typedef {object} EventEmitter
 * @property {(event: string, ...args: any[]) => void} emit
 * @property {(event: string, callback: Function) => void} on
 */

const EventEmitterContext = createContext(
  /** @type {EventEmitter} */ ({
    emit: () => {},
    on: () => {}
  })
)

export default EventEmitterContext
