import { useRef } from "react"

import { composeAll, containsAlphabetsDigitsSpecialOrSpacesOnly, curry, matchesHexColour, matchesYYYYMMDDDate, notEmpty, notLongerThan } from "@han-keong/tms-validators"

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
export default function useNewPlan(args) {
  const { appName = "", showError = true, allowClean = false, on } = args ?? {}

  const result = useRef({})

  return useForm({
    name: "new plan",
    inputs: {
      plan: useFormInput({
        initialValue: "",
        result: result.current,
        key: "plan",
        required: true,
        nullable: false,
        immediately: composeAll([notEmpty, notLongerThan(32), containsAlphabetsDigitsSpecialOrSpacesOnly], { prefix: "Plan MVP Name" })
      }),
      colour: useFormInput({
        initialValue: "#000000",
        result: result.current,
        key: "colour",
        required: true,
        nullable: false,
        immediately: composeAll([notEmpty, matchesHexColour], { prefix: "Plan Colour" })
      }),
      startDate: useFormInput({
        initialValue: /** @type {string?} */ (null),
        result: result.current,
        key: "startDate",
        nullable: true,
        immediately: curry(matchesYYYYMMDDDate, { prefix: "Plan Start Date", message: "must be a valid date" })
      }),
      endDate: useFormInput({
        initialValue: /** @type {string?} */ (null),
        result: result.current,
        key: "endDate",
        nullable: true,
        immediately: curry(matchesYYYYMMDDDate, { prefix: "Plan End Date", message: "must be a valid date" })
      })
    },
    result: result.current,
    endpoint: API.postProjectPlans,
    urlParams: appName,
    showError,
    allowClean,
    on
  })
}
