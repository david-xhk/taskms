import { useState } from "react"

import useEventEmitter from "src/contexts/EventEmitterContext/useEventEmitter"
import useFlashMessage from "src/contexts/FlashMessageContext/useFlashMessage"
import useInsertionCallback from "src/hooks/useInsertionCallback"

/**
 * @typedef {typeof import("src/api").default} API
 * @typedef {import("src/api").Endpoint} Endpoint
 * @typedef {import("src/api").EndpointCallbacks} EndpointCallbacks
 */

/**
 * @template T
 * @callback EndpointFunction
 * @param {object} [args]
 * @param {boolean} [args.showError]
 * @param {EndpointCallbacks | (EndpointCallbacks | undefined)[]} [args.callbacks]
 * @returns {Promise<T>}
 */

/**
 * @param {object} args
 * @param {string} args.name
 * @param {API[Exclude<keyof API, "prototype">]} args.endpoint
 * @param {boolean} [args.showError]
 * @param {{ [event: string]: Function | Function[] }} [args.on]
 * @returns {{
 *   isPending: boolean;
 *   result: any;
 *   call: (args: { name?: string; showError?: boolean; } & Parameters<Endpoint>[0]) => Promise<any?>;
 * }}
 */
export default function useApi(args) {
  const { name, endpoint, showError } = args

  const [isPending, setIsPending] = useState(false)
  const [result, setResult] = useState(/** @type {any?} */ (null))

  const flashMessage = useFlashMessage()
  const { emit, onCancel } = useEventEmitter({ name, on: args.on })

  /** @type {(args?: { name?: string; showError?: boolean; } & Parameters<Endpoint>[0]) => Promise<any?>} */
  const call = useInsertionCallback(args => {
    return new Promise(resolve => {
      if (isPending) {
        return resolve(null)
      }
      const { name, showError: argsShowError, urlParams, queryParams, data, callbacks } = args ?? {}
      const abort = endpoint({
        urlParams,
        queryParams,
        data,
        callbacks: [
          {
            onStart: () => setIsPending(true),
            onFinally: () => setIsPending(false)
          },
          ...(Array.isArray(callbacks) ? callbacks : [callbacks]),
          {
            onSuccess: res => emit(name ? `${name} success` : "success", res),
            onError: res => emit(name ? `${name} error` : "error", res.status, res.data?.message)
          },
          {
            onSuccess: res => setResult(res),
            ...((argsShowError !== undefined ? argsShowError : showError) && {
              onError: res => {
                if (!res.data?.errors) {
                  flashMessage(res.data?.message ?? "Unknown error occured. Please try again later.", "danger")
                }
              }
            })
          },
          {
            onSuccess: res => resolve(res),
            onError: () => resolve(null)
          }
        ]
      })
      onCancel(abort)
    })
  })

  return { isPending, result, call }
}
