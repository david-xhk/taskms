import ProjectTask from "@han-keong/tms-types/ProjectTask"

import API from "src/api"

import useData from "./useData"

/**
 * @param {object} [args]
 * @param {string?} [args.appName]
 * @param {boolean} [args.showError]
 * @param {{ [event: string]: Function | Function[] }} [args.on]
 */
export default function useTasks(args) {
  const { appName = "", showError = true, on } = args ?? {}

  return useData({
    name: "tasks",
    datatype: ProjectTask,
    cardinality: "many",
    endpoint: API.getProjectTasks,
    urlParams: appName,
    showError,
    on
  })
}
