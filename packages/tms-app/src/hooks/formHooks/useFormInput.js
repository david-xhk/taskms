import { useMemo, useRef, useState } from "react"

import { deleteError, getError, hasError } from "@han-keong/tms-validators"

import config from "src/config"
import useInsertionCallback from "src/hooks/useInsertionCallback"

/**
 * @typedef {import("@han-keong/tms-validators").ValidationResult} ValidationResult
 * @typedef {import("@han-keong/tms-validators").Validator} Validator
 */

/**
 * @template {string} K
 * @template V
 * @template {boolean} N
 * @typedef {object} FormInput
 * @property {K} key
 * @property {N extends true ? V? : V} value
 * @property {boolean} required
 * @property {boolean} dirty
 * @property {string?} error
 * @property {boolean} invalid
 * @property {boolean?} valid
 * @property {boolean} validating
 * @property {(value: V | { target: V extends boolean ? { checked: V } : { value: V }} | { currentTarget: V extends boolean ? { checked: V } : { value: V }}) => void} onChange
 * @property {() => void} reset
 * @property {() => boolean} validate
 */

/**
 * @template {string} K
 * @template V
 * @template {boolean} N
 * @param {object} args
 * @param {K} args.key
 * @param {N extends true ? V? : V} args.initialValue
 * @param {ValidationResult} [args.result]
 * @param {boolean} [args.required]
 * @param {N} [args.nullable]
 * @param {Validator} [args.immediately]
 * @param {Validator} [args.afterDelay]
 * @returns {FormInput<K, V, N>}
 */
export default function useFormInput(args) {
  const { key, initialValue, result = {}, required = false, nullable = false, immediately, afterDelay } = args

  const [dirty, setDirty] = useState(false)
  const [valid, setValid] = useState(/** @type {boolean?} */ (immediately && typeof initialValue === "string" && !initialValue ? null : true))
  const [value, setValue] = useState(initialValue)
  const delay = useRef(/** @type {NodeJS.Timeout?} */ (null))

  const error = getError(result, key)
  const invalid = valid === false || hasError(result, key)
  const validating = dirty && valid === null

  /** @type {(value: V | { target: V extends boolean ? { checked: V } : { value: V }} | { currentTarget: V extends boolean ? { checked: V } : { value: V }}) => N extends true ? V? : V} */
  function getValue(arg) {
    let newValue = arg
    if (arg !== null && typeof arg === "object") {
      for (let key of ["target", "currentTarget"]) {
        if (key in arg && arg[key] !== null && typeof arg[key] === "object") {
          if (typeof value === "boolean") {
            if ("checked" in arg[key]) {
              newValue = arg[key].checked
              break
            }
          } else {
            if ("value" in arg[key]) {
              newValue = arg[key].value
              break
            }
          }
        }
      }
    }
    return /** @type {N extends true ? V? : V} */ (nullable && newValue === "" ? null : newValue)
  }

  const onChange = useInsertionCallback(
    /** @type {(value: V | { target: V extends boolean ? { checked: V } : { value: V }} | { currentTarget: V extends boolean ? { checked: V } : { value: V }}) => void} */ (
      value => {
        const newValue = getValue(value)
        console.log(key, "change", JSON.stringify(newValue))
        deleteError(result, key)
        if (delay.current) {
          clearTimeout(delay.current)
          delay.current = null
        }
        setValue(newValue)
        const dirty = JSON.stringify(newValue) !== JSON.stringify(initialValue)
        setDirty(dirty)
        if (!required && (!dirty || (nullable && newValue === null))) {
          setValid(true)
          if (delay.current) {
            clearTimeout(delay.current)
            delay.current = null
          }
          return
        }
        if (!immediately) {
          setValid(true)
        } else if (!immediately(newValue, result, { key })) {
          setValid(false)
        } else if (!afterDelay) {
          setValid(true)
        } else {
          setValid(null)
          delay.current = setTimeout(() => {
            setValid(afterDelay(newValue, result, { key }))
            delay.current = null
          }, config.VALIDATION_DELAY_MS)
        }
      }
    )
  )

  const reset = useInsertionCallback((keepCurrentValues = false) => {
    setDirty(false)
    setValid(immediately && typeof initialValue === "string" && !initialValue ? null : true)
    if (!keepCurrentValues) {
      setValue(initialValue)
    }
    if (delay.current) {
      clearTimeout(delay.current)
      delay.current = null
    }
    deleteError(result, key)
  })

  const validate = useInsertionCallback(() => {
    let valid = !hasError(result, key)
    if ((required || (dirty && !(nullable && value === null))) && valid && immediately) {
      valid &&= immediately(value, result, { key })
      if (valid && afterDelay) {
        valid &&= afterDelay(value, result, { key })
      }
    }
    setValid(valid)
    return valid
  })

  return useMemo(() => ({ key, value, required, dirty, error, invalid, valid, validating, onChange, reset, validate }), [key, value, required, dirty, error, invalid, valid, validating, onChange, reset, validate])
}
