import { createContext } from "react"

const FlashMessageContext = createContext(/** @type {React.MutableRefObject<HTMLDivElement?>?} */ (null))

export default FlashMessageContext
