import { useRef } from "react"

import { curry, matchesYYYYMMDDDate, notEmpty } from "@han-keong/tms-validators"

import API from "src/api"

import useForm from "./useForm"
import useFormInput from "./useFormInput"

/**
 * @param {object} [args]
 * @param {import("@han-keong/tms-types/Project").default?} [args.app]
 * @param {boolean} [args.showError]
 * @param {boolean} [args.allowClean]
 * @param {{ [event: string]: Function | Function[] }} [args.on]
 */
export default function useEditApp(args) {
  const { app = null, showError = true, allowClean = false, on } = args ?? {}

  const result = useRef({})

  return useForm({
    name: "edit app",
    inputs: {
      permitCreate: useFormInput({
        initialValue: app?.permit.create ?? [],
        result: result.current,
        key: "permitCreate",
        nullable: false,
        immediately: curry(notEmpty, { prefix: "App Permit Create" })
      }),
      permitOpen: useFormInput({
        initialValue: app?.permit.open ?? [],
        result: result.current,
        key: "permitOpen",
        nullable: false,
        immediately: curry(notEmpty, { prefix: "App Permit Open" })
      }),
      permitTodo: useFormInput({
        initialValue: app?.permit.todo ?? [],
        result: result.current,
        key: "permitTodo",
        nullable: false,
        immediately: curry(notEmpty, { prefix: "App Permit Todo" })
      }),
      permitDoing: useFormInput({
        initialValue: app?.permit.doing ?? [],
        result: result.current,
        key: "permitDoing",
        nullable: false,
        immediately: curry(notEmpty, { prefix: "App Permit Doing" })
      }),
      permitDone: useFormInput({
        initialValue: app?.permit.done ?? [],
        result: result.current,
        key: "permitDone",
        nullable: false,
        immediately: curry(notEmpty, { prefix: "App Permit Done" })
      }),
      startDate: useFormInput({
        initialValue: app?.startDate ? app.startDate.toDateString() : null,
        result: result.current,
        key: "startDate",
        nullable: true,
        immediately: curry(matchesYYYYMMDDDate, { prefix: "App Start Date", message: "must be a valid date" })
      }),
      endDate: useFormInput({
        initialValue: app?.endDate ? app.endDate.toDateString() : null,
        result: result.current,
        key: "endDate",
        nullable: true,
        immediately: curry(matchesYYYYMMDDDate, { prefix: "App End Date", message: "must be a valid date" })
      }),
      description: useFormInput({
        initialValue: app?.description ?? null,
        result: result.current,
        key: "description",
        nullable: true
      })
    },
    result: result.current,
    endpoint: API.patchProject,
    urlParams: app?.projectName ?? "",
    showError,
    allowClean,
    on
  })
}
