import { useRef } from "react"

import { composeAll, containsAlphabetsDigitsAndSpecial, containsAlphabetsDigitsOrSpecialOnly, matchesEmailAddress, notLongerThan, notShorterThan } from "@han-keong/tms-validators"

import API from "src/api"

import useForm from "./useForm"
import useFormInput from "./useFormInput"

/**
 * @param {object} [args]
 * @param {import("@han-keong/tms-types/User").default?} [args.user]
 * @param {boolean} [args.isCurrentUser]
 * @param {boolean} [args.showError]
 * @param {boolean} [args.allowClean]
 * @param {{ [event: string]: Function | Function[] }} [args.on]
 */
export default function useEditUser(args) {
  const { user = null, isCurrentUser = false, showError = true, allowClean = false, on } = args ?? {}

  const result = useRef({})

  return useForm({
    name: "edit user",
    inputs: {
      password: useFormInput({
        initialValue: "",
        result: result.current,
        key: "password",
        nullable: false,
        immediately: composeAll([notLongerThan(10), containsAlphabetsDigitsOrSpecialOnly]),
        afterDelay: composeAll([notShorterThan(8), containsAlphabetsDigitsAndSpecial])
      }),
      email: useFormInput({
        initialValue: user?.email ?? null,
        result: result.current,
        key: "email",
        nullable: true,
        immediately: notLongerThan(254),
        afterDelay: matchesEmailAddress
      }),
      active: useFormInput({
        initialValue: user?.active ?? true,
        result: result.current,
        key: "active",
        nullable: false
      }),
      groups: useFormInput({
        initialValue: user?.groups ?? [],
        result: result.current,
        key: "groups",
        nullable: false
      })
    },
    result: result.current,
    ...(!user || isCurrentUser ? { endpoint: API.patchCurrentUser } : { endpoint: API.patchUser, urlParams: user.username }),
    showError,
    allowClean,
    on
  })
}
