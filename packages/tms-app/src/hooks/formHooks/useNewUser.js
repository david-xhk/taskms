import { useRef } from "react"

import { composeAll, containsAlphabetsDigitsAndSpecial, containsAlphabetsDigitsOrSpecialOnly, containsAlphabetsOrDigitsOnly, matchesEmailAddress, notLongerThan, notShorterThan } from "@han-keong/tms-validators"

import API from "src/api"

import useForm from "./useForm"
import useFormInput from "./useFormInput"

/**
 * @param {object} [args]
 * @param {boolean} [args.showError]
 * @param {boolean} [args.allowClean]
 * @param {{ [event: string]: Function | Function[] }} [args.on]
 */
export default function useNewUser(args) {
  const { showError = true, allowClean = false, on } = args ?? {}

  const result = useRef({})

  return useForm({
    name: "new user",
    inputs: {
      username: useFormInput({
        initialValue: "",
        result: result.current,
        key: "username",
        required: true,
        nullable: false,
        immediately: composeAll([notLongerThan(32), containsAlphabetsOrDigitsOnly]),
        afterDelay: notShorterThan(2)
      }),
      password: useFormInput({
        initialValue: "",
        result: result.current,
        key: "password",
        required: true,
        nullable: false,
        immediately: composeAll([notLongerThan(10), containsAlphabetsDigitsOrSpecialOnly]),
        afterDelay: composeAll([notShorterThan(8), containsAlphabetsDigitsAndSpecial])
      }),
      email: useFormInput({
        initialValue: /** @type {string?} */ (null),
        result: result.current,
        key: "email",
        nullable: true,
        immediately: notLongerThan(254),
        afterDelay: matchesEmailAddress
      }),
      active: useFormInput({
        initialValue: true,
        result: result.current,
        key: "active",
        required: true,
        nullable: false
      }),
      groups: useFormInput({
        initialValue: /** @type {string[]} */ ([]),
        result: result.current,
        key: "groups",
        nullable: false
      })
    },
    result: result.current,
    endpoint: API.postUsers,
    showError,
    allowClean,
    on
  })
}
