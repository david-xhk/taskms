import ProjectPlan from "@han-keong/tms-types/ProjectPlan"

import API from "src/api"

import useData from "./useData"

/**
 * @param {object} [args]
 * @param {string | undefined} [args.appName]
 * @param {string | undefined} [args.planName]
 * @param {boolean} [args.showError]
 * @param {{ [event: string]: Function | Function[] }} [args.on]
 */
export default function usePlan(args) {
  const { appName = "", planName = "", showError = true, on } = args ?? {}

  return useData({
    name: "plan",
    datatype: ProjectPlan,
    cardinality: "one",
    endpoint: API.getProjectPlan,
    urlParams: [appName, planName],
    showError,
    on
  })
}
