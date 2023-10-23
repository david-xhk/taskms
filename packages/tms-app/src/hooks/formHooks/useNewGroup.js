import { useRef } from "react"

import { composeAll, containsAlphabetsDigitsSpecialOrSpacesOnly, notEmpty, notLongerThan } from "@han-keong/tms-validators"

import API from "src/api"

import useForm from "./useForm"
import useFormInput from "./useFormInput"

/**
 * @param {object} [args]
 * @param {boolean} [args.showError]
 * @param {boolean} [args.allowClean]
 * @param {{ [event: string]: Function | Function[] }} [args.on]
 */
export default function useNewGroup(args) {
  const { showError = true, allowClean = false, on } = args ?? {}

  const result = useRef({})

  return useForm({
    name: "new group",
    inputs: {
      group: useFormInput({
        initialValue: "",
        result: result.current,
        key: "group",
        nullable: false,
        immediately: composeAll([notEmpty, notLongerThan(32), containsAlphabetsDigitsSpecialOrSpacesOnly])
      })
    },
    result: result.current,
    endpoint: API.postGroups,
    showError,
    allowClean,
    on
  })
}
