import { useCallback } from "react"
import API from "src/api"

import useApi from "src/hooks/apiHooks/useApi"

/**
 * @param {object} [args]
 * @param {boolean} [args.showError]
 * @param {{ [event: string]: Function | Function[] }} [args.on]
 */
export default function useToggleActiveUser(args) {
  const { showError = true, on } = args ?? {}

  const { call } = useApi({
    name: "toggle active user",
    endpoint: API.patchUser,
    showError,
    on
  })

  return useCallback(user => call({ urlParams: user.username, data: { active: !user.active } }), [call])
}
