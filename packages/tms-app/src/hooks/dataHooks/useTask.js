import ProjectTask from "@han-keong/tms-types/ProjectTask"

import API from "src/api"

import useData from "./useData"

/**
 * @param {object} [args]
 * @param {string | undefined} [args.appName]
 * @param {string | undefined} [args.taskNum]
 * @param {boolean} [args.showError]
 * @param {{ [event: string]: Function | Function[] }} [args.on]
 */
export default function useTask(args) {
  const { appName = "", taskNum = "", showError = true, on } = args ?? {}

  return useData({
    name: "task",
    datatype: ProjectTask,
    cardinality: "one",
    endpoint: API.getProjectTask,
    urlParams: `${appName}_${taskNum}`,
    showError,
    on
  })
}
