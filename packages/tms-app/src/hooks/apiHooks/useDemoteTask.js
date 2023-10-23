import { useCallback } from "react"
import API from "src/api"

import useApi from "src/hooks/apiHooks/useApi"

/**
 * @param {object} [args]
 * @param {boolean} [args.showError]
 * @param {{ [event: string]: Function | Function[] }} [args.on]
 */
export default function useDemoteTask(args) {
  const { showError = true, on } = args ?? {}

  const { call } = useApi({
    name: "demote task",
    endpoint: API.patchProjectTask,
    showError,
    on
  })

  return useCallback(task => call({ urlParams: task.taskId, data: { state: task.previousState } }), [call])
}
