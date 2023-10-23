import { useRef } from "react"

import { composeAll, containsAlphabetsDigitsSpecialOrSpacesOnly, createValidator, notEmpty, notLongerThan } from "@han-keong/tms-validators"

import API from "src/api"

import useForm from "./useForm"
import useFormInput from "./useFormInput"

/**
 * @param {object} [args]
 * @param {import("@han-keong/tms-types/ProjectTask").default?} [args.task]
 * @param {boolean} [args.showError]
 * @param {boolean} [args.allowClean]
 * @param {{ [event: string]: Function | Function[] }} [args.on]
 */
export default function useEditTask(args) {
  const { task = null, showError = true, allowClean = false, on } = args ?? {}

  const result = useRef({})

  return useForm({
    name: "edit task",
    inputs: {
      state: useFormInput({
        initialValue: task?.state ?? "open",
        result: result.current,
        key: "state",
        nullable: false,
        ...(task && { immediately: createValidator(state => task.isValidTransition(state), "transition is invalid", { prefix: "Task State" }) })
      }),
      plan: useFormInput({
        initialValue: task?.plan ?? null,
        result: result.current,
        key: "plan",
        nullable: true,
        immediately: composeAll([notEmpty, notLongerThan(32), containsAlphabetsDigitsSpecialOrSpacesOnly], { prefix: "Task Plan" })
      })
    },
    result: result.current,
    endpoint: API.patchProjectTask,
    urlParams: task?.taskId ?? "",
    showError,
    allowClean,
    on
  })
}
