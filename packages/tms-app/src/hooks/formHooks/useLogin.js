import { useRef } from "react"

import { notEmpty } from "@han-keong/tms-validators"

import API from "src/api"

import useForm from "./useForm"
import useFormInput from "./useFormInput"

/**
 * @param {object} [args]
 * @param {boolean} [args.showError]
 * @param {boolean} [args.allowClean]
 * @param {{ [event: string]: Function | Function[] }} [args.on]
 */
export default function useLogin(args) {
  const { showError = true, allowClean = false, on } = args ?? {}

  const result = useRef({})

  return useForm({
    name: "login",
    inputs: {
      username: useFormInput({
        initialValue: "",
        result: result.current,
        key: "username",
        required: true,
        nullable: false,
        immediately: notEmpty
      }),
      password: useFormInput({
        initialValue: "",
        result: result.current,
        key: "password",
        required: true,
        nullable: false,
        immediately: notEmpty
      })
    },
    result: result.current,
    endpoint: API.login,
    showError,
    allowClean,
    on
  })
}
