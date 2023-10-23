import { useContext } from "react"

import AppsContext from "./AppsContext"

export default function useAppsContext() {
  return useContext(AppsContext)
}
