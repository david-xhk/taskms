import { useMemo, useState } from "react"

import useApi from "src/hooks/apiHooks/useApi"
import useInsertionCallback from "src/hooks/useInsertionCallback"

/**
 * @typedef {typeof import("@han-keong/tms-types/Base").default} Base
 * @typedef {typeof import("src/api").default} API
 */

/**
 * @template T
 * @typedef {import("src/hooks/apiHooks/useApi").EndpointFunction<T>} EndpointFunction
 */

/**
 * @template {Base} T
 * @template {"one" | "many"} M
 * @param {object} args
 * @param {string} args.name
 * @param {T} args.datatype
 * @param {M} args.cardinality
 * @param {API[Exclude<keyof API, "prototype">]} args.endpoint
 * @param {any} [args.urlParams]
 * @param {boolean} [args.showError]
 * @param {{ [event: string]: Function | Function[] }} [args.on]
 */
export default function useData(args) {
  const { name, datatype, cardinality, endpoint, showError, urlParams, on } = args

  const [notFound, setNotFound] = useState(false)

  const { isPending: isFetching, result, call: callApi } = useApi({ name, endpoint, showError, on })

  /** @type {M extends "many" ? InstanceType<T>[] : InstanceType<T>?} */
  const data = useMemo(() => (cardinality === "many" ? result ?? [] : result), [cardinality, result])

  /** @type {EndpointFunction<(M extends "many" ? InstanceType<T>[] : InstanceType<T>)?>} */
  const fetch = useInsertionCallback(async args => {
    const { showError, callbacks } = args ?? {}
    return await callApi({
      name: "fetch",
      showError,
      urlParams,
      callbacks: [
        {
          onSuccess: res => {
            setNotFound(false)
            if (cardinality === "many") {
              return res.data.data.map(data => datatype.create(data))
            } else {
              return datatype.create(res.data.data)
            }
          }
        },
        ...(Array.isArray(callbacks) ? callbacks : [callbacks]),
        {
          onError: res => {
            if (res.status === 404) {
              setNotFound(true)
            }
          }
        }
      ]
    })
  })

  return { isFetching, data, notFound, fetch }
}
