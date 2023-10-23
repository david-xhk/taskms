import Project from "@han-keong/tms-types/Project"

import API from "src/api"

import useData from "./useData"

/**
 * @param {object} [args]
 * @param {string | undefined} [args.appName]
 * @param {boolean} [args.showError]
 * @param {{ [event: string]: Function | Function[] }} [args.on]
 */
export default function useApp(args) {
  const { appName = "", showError = true, on } = args ?? {}

  return useData({
    name: "app",
    datatype: Project,
    cardinality: "one",
    endpoint: API.getProject,
    urlParams: appName,
    showError,
    on
  })
}
