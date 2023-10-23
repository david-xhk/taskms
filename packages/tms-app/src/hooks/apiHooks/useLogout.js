import API from "src/api"

import useApi from "src/hooks/apiHooks/useApi"

/**
 * @param {object} [args]
 * @param {boolean} [args.showError]
 * @param {{ [event: string]: Function | Function[] }} [args.on]
 */
export default function useLogout(args) {
  const { showError = true, on } = args ?? {}

  return useApi({
    name: "logout",
    endpoint: API.logout,
    showError,
    on
  })
}
