import TaskNote from "@han-keong/tms-types/TaskNote"

import API from "src/api"

import useData from "./useData"

/**
 * @param {object} [args]
 * @param {string?} [args.taskId]
 * @param {boolean} [args.showError]
 * @param {{ [event: string]: Function | Function[] }} [args.on]
 */
export default function useNotes(args) {
  const { taskId = "", showError = true, on } = args ?? {}

  return useData({
    name: "notes",
    datatype: TaskNote,
    cardinality: "many",
    endpoint: API.getProjectTaskNotes,
    urlParams: taskId,
    showError,
    on
  })
}
