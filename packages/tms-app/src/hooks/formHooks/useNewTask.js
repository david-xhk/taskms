import { useRef } from "react"

import { composeAll, containsAlphabetsDigitsSpecialOrSpacesOnly, curry, notEmpty, notLongerThan } from "@han-keong/tms-validators"

import API from "src/api"

import useForm from "./useForm"
import useFormInput from "./useFormInput"

/**
 * @param {object} [args]
 * @param {string?} [args.appName]
 * @param {boolean} [args.showError]
 * @param {boolean} [args.allowClean]
 * @param {{ [event: string]: Function | Function[] }} [args.on]
 */
export default function useNewTask(args) {
  const { appName = "", showError = true, allowClean = false, on } = args ?? {}

  const result = useRef({})

  return useForm({
    name: "new task",
    inputs: {
      task: useFormInput({
        initialValue: "",
        result: result.current,
        key: "task",
        required: true,
        nullable: false,
        immediately: composeAll([notEmpty, notLongerThan(32), containsAlphabetsDigitsSpecialOrSpacesOnly], { prefix: "Task Name" })
      }),
      description: useFormInput({
        initialValue: "",
        result: result.current,
        key: "description",
        required: true,
        nullable: false,
        immediately: curry(notEmpty, { prefix: "Task Description" })
      }),
      plan: useFormInput({
        initialValue: /** @type {string?} */ (null),
        result: result.current,
        key: "plan",
        nullable: true,
        immediately: composeAll([notLongerThan(32), containsAlphabetsDigitsSpecialOrSpacesOnly], { prefix: "Task Plan" })
      }),
      note: useFormInput({
        initialValue: "",
        result: result.current,
        key: "note",
        nullable: true
      })
    },
    result: result.current,
    endpoint: API.postProjectTasks,
    urlParams: appName,
    showError,
    allowClean,
    on
  })
}
