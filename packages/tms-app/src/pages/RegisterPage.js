import React, { useEffect } from "react"
import { useImmerReducer } from "use-immer"

import { validateEmail, validateEmailDelayed, validateEmailImmediately, validatePassword, validatePasswordDelayed, validatePasswordImmediately, validateUsername, validateUsernameDelayed, validateUsernameImmediately } from "@han-keong/tms-validators/userValidator"
import { getError, getErrors, hasError, hasErrors, setErrors } from "@han-keong/tms-validators/validators"

import ValidationError from "../components/ValidationError.js"
import config from "../config.js"
import useAuth from "../hooks/useAuth.js"
import useEventEmitter from "../hooks/useEventEmitter.js"
import Page from "./Page.js"

export default function RegisterPage() {
  const auth = useAuth()
  const { emit } = useEventEmitter("RegisterPage")

  function reducer(draft, action) {
    switch (action.type) {
      case "userImmediately":
        if (action.value !== undefined) {
          draft.user = action.value
        }
        validateUsernameImmediately(draft.user, draft.result)
        break
      case "userAfterDelay":
        if (!hasError(draft.result, "user")) {
          validateUsernameDelayed(draft.user, draft.result)
        }
        break
      case "emailImmediately":
        if (action.value !== undefined) {
          draft.email = action.value
        }
        validateEmailImmediately(draft.email, draft.result)
        break
      case "emailAfterDelay":
        if (!hasError(draft.result, "email")) {
          validateEmailDelayed(draft.email, draft.result)
        }
        break
      case "passwordImmediately":
        if (action.value !== undefined) {
          draft.password = action.value
        }
        validatePasswordImmediately(draft.password, draft.result)
        break
      case "passwordAfterDelay":
        if (!hasError(draft.result, "password")) {
          validatePasswordDelayed(draft.password, draft.result)
        }
        break
      case "submitForm":
        validateUsername(draft.user, draft.result)
        validateEmail(draft.email, draft.result)
        validatePassword(draft.password, draft.result)
        if (!hasErrors(draft.result)) {
          draft.submitOrdinal++
        }
        break
      case "formErrors":
        setErrors(draft.result, action.errors)
        break
    }

    const args = []
    const { type, ...values } = action
    if (Object.keys(values).length > 0) {
      args.push(values)
    }
    const state = {}
    if (hasErrors(draft.result)) {
      state.errors = Object.keys(getErrors(draft.result)).join(", ")
    }
    if (Object.keys(state).length > 0) {
      args.push(state)
    }
    emit(type, ...args)
  }

  const [state, dispatch] = useImmerReducer(reducer, {
    user: "",
    password: "",
    email: "",
    submitOrdinal: 0,
    result: {}
  })

  useEffect(() => {
    if (state.user) {
      const timeout = setTimeout(() => dispatch({ type: "userAfterDelay" }), config.VALIDATION_DELAY_MS)
      return () => clearTimeout(timeout)
    }
  }, [state.user])

  useEffect(() => {
    if (state.email) {
      const timeout = setTimeout(() => dispatch({ type: "emailAfterDelay" }), config.VALIDATION_DELAY_MS)
      return () => clearTimeout(timeout)
    }
  }, [state.email])

  useEffect(() => {
    if (state.password) {
      const timeout = setTimeout(() => dispatch({ type: "passwordAfterDelay" }), config.VALIDATION_DELAY_MS)
      return () => clearTimeout(timeout)
    }
  }, [state.password])

  useEffect(() => {
    if (state.submitOrdinal) {
      return auth.register(state.user, state.email, state.password, errors => dispatch({ type: "formErrors", errors }))
    }
  }, [state.submitOrdinal])

  function handleSubmit(e) {
    e.preventDefault()
    if (!hasErrors(state.result)) {
      dispatch({ type: "submitForm" })
    }
  }

  return (
    <Page title="Welcome">
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Boost Your Productivity</h1>
          <p className="lead text-muted">Simplify your work with our task management system. Get organized, stay focused, and achieve more in less time. Sign up now!</p>
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="user-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input onChange={e => dispatch({ type: "userImmediately", value: e.target.value })} value={state.user} id="user-register" name="user" className="form-control" type="text" placeholder="Pick a user" autoComplete="off" />
              <ValidationError visible={hasError(state.result, "user")}>{getError(state.result, "user")}</ValidationError>
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input onChange={e => dispatch({ type: "emailImmediately", value: e.target.value })} value={state.email} id="email-register" name="email" className="form-control" type="text" placeholder="you@example.com" autoComplete="off" />
              <ValidationError visible={hasError(state.result, "email")}>{getError(state.result, "email")}</ValidationError>
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input onChange={e => dispatch({ type: "passwordImmediately", value: e.target.value })} value={state.password} id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" />
              <ValidationError visible={hasError(state.result, "password")}>{getError(state.result, "password")}</ValidationError>
            </div>
            <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
              Sign up
            </button>
          </form>
        </div>
      </div>
    </Page>
  )
}
