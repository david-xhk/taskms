import Project from "@han-keong/tms-types/Project"

import API from "src/api"

import useData from "./useData"

/**
 * @param {object} [args]
 * @param {boolean} [args.showError]
 * @param {{ [event: string]: Function | Function[] }} [args.on]
 */
export default function useApps(args) {
  const { showError = true, on } = args ?? {}

  return useData({
    name: "apps",
    datatype: Project,
    cardinality: "many",
    endpoint: API.getProjects,
    showError,
    on
  })
}
