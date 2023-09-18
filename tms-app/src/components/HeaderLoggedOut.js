import React, { useEffect } from "react"
import { useImmerReducer } from "use-immer"

import { validateLoginPassword, validateLoginUsername } from "tms-all/validators/userValidator.js"
import { deleteError, hasError } from "tms-all/validators/validators.js"

import useAuth from "../hooks/useAuth"

export default function HeaderLoggedOut() {
  const [state, dispatch] = useImmerReducer(reducer, {
    username: "",
    password: "",
    submitOrdinal: 0
  })

  const auth = useAuth()

  useEffect(() => {
    if (state.submitOrdinal) {
      return auth.login(state.username, state.password)
    }
  }, [state.submitOrdinal])

  function handleSubmit(e) {
    e.preventDefault()
    if (!hasError(state)) {
      dispatch({ type: "submitForm" })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-1 mb-3 my-sm-0">
      <div className="row align-items-center">
        <div className="col-sm mr-0 pr-sm-0 mb-2 mb-sm-0">
          <input onChange={e => dispatch({ type: "usernameChanged", value: e.target.value })} value={state.username} name="username" className={"form-control form-control-sm input-dark " + (hasError(state, "username") && "is-invalid")} type="text" placeholder="Username" autoComplete="off" />
        </div>
        <div className="col-sm mr-0 pr-sm-0 mb-2 mb-sm-0">
          <input onChange={e => dispatch({ type: "passwordChanged", value: e.target.value })} value={state.password} name="password" className={"form-control form-control-sm input-dark " + (hasError(state, "password") && "is-invalid")} type="password" placeholder="Password" autoComplete="off" />
        </div>
        <div className="col-sm-auto">
          <button className="btn btn-success btn-sm">Login</button>
        </div>
      </div>
    </form>
  )
}

function reducer(draft, action) {
  switch (action.type) {
    case "usernameChanged":
      deleteError(draft, "username")
      draft.username = action.value
      break
    case "passwordChanged":
      deleteError(draft, "password")
      draft.password = action.value
      break
    case "submitForm":
      validateLoginUsername(draft.username, draft)
      validateLoginPassword(draft.password, draft)
      if (!hasError(draft)) {
        draft.submitOrdinal++
      }
      break
  }
}
