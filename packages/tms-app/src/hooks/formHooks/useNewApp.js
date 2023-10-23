import { useRef } from "react"

import { composeAll, containsAlphabetsDigitsOrDashesOnly, curry, matchesInteger, matchesYYYYMMDDDate, notEmpty, notLessThan, notLongerThan } from "@han-keong/tms-validators"

import API from "src/api"

import useForm from "./useForm"
import useFormInput from "./useFormInput"

/**
 * @param {object} [args]
 * @param {boolean} [args.showError]
 * @param {boolean} [args.allowClean]
 * @param {{ [event: string]: Function | Function[] }} [args.on]
 */
export default function useNewApp(args) {
  const { showError = true, allowClean = false, on } = args ?? {}

  const result = useRef({})

  return useForm({
    name: "new app",
    inputs: {
      project: useFormInput({
        initialValue: "",
        result: result.current,
        key: "project",
        required: true,
        nullable: false,
        immediately: composeAll([notEmpty, notLongerThan(32), containsAlphabetsDigitsOrDashesOnly], { prefix: "App Acronym" })
      }),
      runningNum: useFormInput({
        initialValue: "",
        result: result.current,
        key: "runningNum",
        required: true,
        nullable: false,
        immediately: composeAll([notEmpty, matchesInteger, notLessThan(0)], { prefix: "App RNum" })
      }),
      permitCreate: useFormInput({
        initialValue: /** @type {string[]} */ ([]),
        result: result.current,
        key: "permitCreate",
        required: true,
        nullable: false,
        immediately: curry(notEmpty, { prefix: "App Permit Create" })
      }),
      permitOpen: useFormInput({
        initialValue: /** @type {string[]} */ ([]),
        result: result.current,
        key: "permitOpen",
        required: true,
        nullable: false,
        immediately: curry(notEmpty, { prefix: "App Permit Open" })
      }),
      permitTodo: useFormInput({
        initialValue: /** @type {string[]} */ ([]),
        result: result.current,
        key: "permitTodo",
        required: true,
        nullable: false,
        immediately: curry(notEmpty, { prefix: "App Permit Todo" })
      }),
      permitDoing: useFormInput({
        initialValue: /** @type {string[]} */ ([]),
        result: result.current,
        key: "permitDoing",
        required: true,
        nullable: false,
        immediately: curry(notEmpty, { prefix: "App Permit Doing" })
      }),
      permitDone: useFormInput({
        initialValue: /** @type {string[]} */ ([]),
        result: result.current,
        key: "permitDone",
        required: true,
        nullable: false,
        immediately: curry(notEmpty, { prefix: "App Permit Done" })
      }),
      startDate: useFormInput({
        initialValue: /** @type {string?} */ (null),
        result: result.current,
        key: "startDate",
        nullable: true,
        immediately: curry(matchesYYYYMMDDDate, { prefix: "App Start Date", message: "must be a valid date" })
      }),
      endDate: useFormInput({
        initialValue: /** @type {string?} */ (null),
        result: result.current,
        key: "endDate",
        nullable: true,
        immediately: curry(matchesYYYYMMDDDate, { prefix: "App End Date", message: "must be a valid date" })
      }),
      description: useFormInput({
        initialValue: /** @type {string?} */ (null),
        result: result.current,
        key: "description",
        nullable: true
      })
    },
    result: result.current,
    endpoint: API.postProjects,
    showError,
    allowClean,
    on
  })
}
