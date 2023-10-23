import User from "@han-keong/tms-types/User"

import API from "src/api"

import useData from "./useData"

/**
 * @param {object} [args]
 * @param {boolean} [args.showError]
 * @param {{ [event: string]: Function | Function[] }} [args.on]
 */
export default function useCurrentUser(args) {
  const { showError = true, on } = args ?? {}

  return useData({
    name: "current user",
    datatype: User,
    cardinality: "one",
    endpoint: API.getCurrentUser,
    showError,
    on
  })
}
