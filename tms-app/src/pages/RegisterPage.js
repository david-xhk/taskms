import React, { useEffect } from "react"
import { useImmerReducer } from "use-immer"

import { validateEmail, validateEmailDelayed, validateEmailImmediately, validatePassword, validatePasswordDelayed, validatePasswordImmediately, validateUsername, validateUsernameDelayed, validateUsernameImmediately } from "tms-all/validators/userValidator.js"
import { getError, getErrors, hasError, setErrors } from "tms-all/validators/validators.js"

import ValidationError from "../components/ValidationError"
import useAuth from "../hooks/useAuth"
import useEventEmitter from "../hooks/useEventEmitter"
import Page from "./Page"

export default function RegisterPage() {
  const auth = useAuth()
  const { emit } = useEventEmitter()

  function reducer(draft, action) {
    switch (action.type) {
      case "usernameImmediately":
        if (action.value !== undefined) {
          draft.username = action.value
        }
        validateUsernameImmediately(draft.username, draft)
        break
      case "usernameAfterDelay":
        if (!hasError(draft, "username")) {
          validateUsernameDelayed(draft.username, draft)
        }
        break
      case "emailImmediately":
        if (action.value !== undefined) {
          draft.email = action.value
        }
        validateEmailImmediately(draft.email, draft)
        break
      case "emailAfterDelay":
        if (!hasError(draft, "email")) {
          validateEmailDelayed(draft.email, draft)
        }
        break
      case "passwordImmediately":
        if (action.value !== undefined) {
          draft.password = action.value
        }
        validatePasswordImmediately(draft.password, draft)
        break
      case "passwordAfterDelay":
        if (!hasError(draft, "password")) {
          validatePasswordDelayed(draft.password, draft)
        }
        break
      case "submitForm":
        validateUsername(draft.username, draft)
        validateEmail(draft.email, draft)
        validatePassword(draft.password, draft)
        if (!hasError(draft)) {
          draft.submitOrdinal++
        }
        break
      case "formErrors":
        setErrors(draft, action.errors)
        break
    }

    const args = []
    const { type, ...values } = action
    if (Object.keys(values).length > 0) {
      args.push(values)
    }
    const state = {}
    if (hasError(draft)) {
      state.errors = Object.keys(getErrors(draft)).join(", ")
    }
    if (Object.keys(state).length > 0) {
      args.push(state)
    }
    emit(action.type, ...args)
  }

  const [state, dispatch] = useImmerReducer(reducer, {
    username: "",
    password: "",
    email: "",
    submitOrdinal: 0
  })

  useEffect(() => {
    if (state.username) {
      const timeout = setTimeout(() => dispatch({ type: "usernameAfterDelay" }), process.env.VALIDATION_DELAY_MS)
      return () => clearTimeout(timeout)
    }
  }, [state.username])

  useEffect(() => {
    if (state.email) {
      const timeout = setTimeout(() => dispatch({ type: "emailAfterDelay" }), process.env.VALIDATION_DELAY_MS)
      return () => clearTimeout(timeout)
    }
  }, [state.email])

  useEffect(() => {
    if (state.password) {
      const timeout = setTimeout(() => dispatch({ type: "passwordAfterDelay" }), process.env.VALIDATION_DELAY_MS)
      return () => clearTimeout(timeout)
    }
  }, [state.password])

  useEffect(() => {
    if (state.submitOrdinal) {
      return auth.register(state.username, state.email, state.password, errors => dispatch({ type: "formErrors", errors }))
    }
  }, [state.submitOrdinal])

  function handleSubmit(e) {
    e.preventDefault()
    if (!hasError(state)) {
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
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input onChange={e => dispatch({ type: "usernameImmediately", value: e.target.value })} value={state.username} id="username-register" name="username" className="form-control" type="text" placeholder="Pick a username" autoComplete="off" />
              <ValidationError visible={hasError(state, "username")}>{getError(state, "username")}</ValidationError>
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input onChange={e => dispatch({ type: "emailImmediately", value: e.target.value })} value={state.email} id="email-register" name="email" className="form-control" type="text" placeholder="you@example.com" autoComplete="off" />
              <ValidationError visible={hasError(state, "email")}>{getError(state, "email")}</ValidationError>
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input onChange={e => dispatch({ type: "passwordImmediately", value: e.target.value })} value={state.password} id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" />
              <ValidationError visible={hasError(state, "password")}>{getError(state, "password")}</ValidationError>
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
