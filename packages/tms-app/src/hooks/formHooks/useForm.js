import { useCallback } from "react"

import * as validators from "@han-keong/tms-validators"

import useApi from "src/hooks/apiHooks/useApi"
import useInsertionCallback from "src/hooks/useInsertionCallback"

/**
 * @typedef {import("axios").AxiosResponse} AxiosResponse
 * @typedef {import("@han-keong/tms-validators").ValidationResult} ValidationResult
 * @typedef {typeof import("src/api").default} API
 * @typedef {import("src/api").EndpointCallbacks} EndpointCallbacks
 */

/**
 * @template {string} K
 * @template V
 * @template {boolean} N
 * @typedef {import("./useFormInput").FormInput<K, V, N>} FormInput
 */

/**
 * @template T
 * @typedef {import("src/hooks/apiHooks/useApi").EndpointFunction<T>} EndpointFunction
 */

/**
 * @template {{ [K in keyof T]: FormInput<K extends string ? K : never, any, boolean> }} T
 * @param {object} args
 * @param {string} args.name
 * @param {T} args.inputs
 * @param {ValidationResult} args.result
 * @param {API[Exclude<keyof API, "prototype">]} args.endpoint
 * @param {any} [args.urlParams]
 * @param {boolean} [args.showError]
 * @param {boolean} [args.allowClean]
 * @param {{ [event: string]: Function | Function[] }} [args.on]
 */
export default function useForm(args) {
  const { name, inputs, result, endpoint, urlParams, showError = true, allowClean = false, on } = args

  // eslint-disable-next-line no-unused-vars
  const { isPending: isSubmitting, call: callApi } = useApi({ name, endpoint, showError, on })

  const data = /** @type {{ [K in keyof T]: T[K]["value"] | undefined }} */ ({})
  let isDirty = false
  let isValidating = false
  let hasRequiredData = true
  for (let [key, input] of Object.entries(inputs)) {
    if (input.valid && (input.dirty || input.required)) {
      data[/** @type {keyof T} */ (key)] = input.value
    }
    if (input.dirty) {
      isDirty = true
    }
    if (input.validating) {
      isValidating = true
    }
    if (input.required && !input.valid) {
      hasRequiredData = false
    }
  }
  const hasErrors = validators.hasErrors(result)
  const allowSubmit = !isSubmitting && (isDirty || allowClean) && !isValidating && hasRequiredData && !hasErrors

  /** @type {(key: keyof T) => boolean} */
  const hasError = useCallback(key => validators.hasError(result, /** @type {string} */ (key)), [result])

  /** @type {(key: keyof T) => string?} */
  const getError = useCallback(key => validators.getError(result, /** @type {string} */ (key)), [result])

  /** @type {EndpointFunction<any?>} */
  const submit = useInsertionCallback(async args => {
    let valid = true
    for (let input of Object.values(inputs)) {
      valid = input.validate() && valid
    }
    // console.log(name, "submit", { allowSubmit, isSubmitting, isDirty, isValidating, hasRequiredData, hasErrors, data })
    if (!allowSubmit || !valid) {
      return null
    }
    const { showError, callbacks } = args ?? {}
    return await callApi({
      name: "submit",
      showError,
      urlParams,
      data,
      callbacks: [
        ...(Array.isArray(callbacks) ? callbacks : [callbacks]),
        {
          onError: res => {
            if (res.data?.errors) {
              validators.setErrors(result, res.data.errors)
              for (let input of Object.values(inputs)) {
                input.validate()
              }
            }
          }
        }
      ]
    })
  })

  const reset = useInsertionCallback((keepCurrentValues = false) => {
    for (let input of Object.values(inputs)) {
      input.reset(keepCurrentValues)
    }
  })

  return { data, isDirty, isSubmitting, allowSubmit, hasError, getError, submit, reset, ...inputs }
}
