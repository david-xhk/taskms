import { useRef } from "react"

import { curry, notEmpty } from "@han-keong/tms-validators"

import API from "src/api"

import useForm from "./useForm"
import useFormInput from "./useFormInput"

/**
 * @param {object} [args]
 * @param {string?} [args.taskId]
 * @param {boolean} [args.showError]
 * @param {boolean} [args.allowClean]
 * @param {{ [event: string]: Function | Function[] }} [args.on]
 */
export default function useNewNote(args) {
  const { taskId = "", showError = true, allowClean = false, on } = args ?? {}

  const result = useRef({})

  return useForm({
    name: "new note",
    inputs: {
      content: useFormInput({
        initialValue: "",
        result: result.current,
        key: "content",
        nullable: false,
        immediately: curry(notEmpty, { prefix: "Note" })
      })
    },
    result: result.current,
    endpoint: API.postProjectTaskNotes,
    urlParams: taskId,
    showError,
    allowClean,
    on
  })
}
