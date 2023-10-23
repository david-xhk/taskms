import Group from "@han-keong/tms-types/Group"

import API from "src/api"

import useData from "./useData"

/**
 * @param {object} [args]
 * @param {boolean} [args.showError]
 * @param {{ [event: string]: Function | Function[] }} [args.on]
 */
export default function useGroups(args) {
  const { showError = true, on } = args ?? {}

  return useData({
    name: "groups",
    datatype: Group,
    cardinality: "many",
    endpoint: API.getGroups,
    showError,
    on
  })
}
