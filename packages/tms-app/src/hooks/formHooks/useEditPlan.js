import { useRef } from "react"

import { curry, matchesHexColour, matchesYYYYMMDDDate } from "@han-keong/tms-validators"

import API from "src/api"

import useForm from "./useForm"
import useFormInput from "./useFormInput"

/**
 * @param {object} [args]
 * @param {import("@han-keong/tms-types/ProjectPlan").default?} [args.plan]
 * @param {boolean} [args.showError]
 * @param {boolean} [args.allowClean]
 * @param {{ [event: string]: Function | Function[] }} [args.on]
 */
export default function useEditPlan(args) {
  const { plan = null, showError = true, allowClean = false, on } = args ?? {}

  const result = useRef({})

  return useForm({
    name: "edit plan",
    inputs: {
      colour: useFormInput({
        initialValue: plan?.colour ?? "#000000",
        result: result.current,
        key: "colour",
        nullable: false,
        immediately: curry(matchesHexColour, { prefix: "Plan Colour" })
      }),
      startDate: useFormInput({
        initialValue: plan?.startDate ? plan.startDate.toDateString() : null,
        result: result.current,
        key: "startDate",
        nullable: true,
        immediately: curry(matchesYYYYMMDDDate, { prefix: "Plan Start Date", message: "must be a valid date" })
      }),
      endDate: useFormInput({
        initialValue: plan?.endDate ? plan.endDate.toDateString() : null,
        result: result.current,
        key: "endDate",
        nullable: true,
        immediately: curry(matchesYYYYMMDDDate, { prefix: "Plan End Date", message: "must be a valid date" })
      })
    },
    result: result.current,
    endpoint: API.patchProjectPlan,
    urlParams: [plan?.project ?? "", plan?.planName ?? ""],
    showError,
    allowClean,
    on
  })
}
