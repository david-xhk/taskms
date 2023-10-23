import ProjectPlan from "@han-keong/tms-types/ProjectPlan"

import API from "src/api"

import useData from "./useData"

/**
 * @param {object} [args]
 * @param {string?} [args.appName]
 * @param {boolean} [args.showError]
 * @param {{ [event: string]: Function | Function[] }} [args.on]
 */
export default function usePlans(args) {
  const { appName = "", showError = true, on } = args ?? {}

  return useData({
    name: "plans",
    datatype: ProjectPlan,
    cardinality: "many",
    endpoint: API.getProjectPlans,
    urlParams: appName,
    showError,
    on
  })
}
