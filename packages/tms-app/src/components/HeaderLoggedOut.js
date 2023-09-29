import React, { useEffect } from "react"
import { useImmerReducer } from "use-immer"

import { deleteError, hasError, hasErrors, notEmpty } from "@han-keong/tms-validators/validators"

import useAuth from "../hooks/useAuth.js"

export default function HeaderLoggedOut() {
  const [state, dispatch] = useImmerReducer(reducer, {
    user: "",
    password: "",
    submitOrdinal: 0,
    result: {}
  })

  const auth = useAuth()

  useEffect(() => {
    if (state.submitOrdinal) {
      return auth.login(state.user, state.password)
    }
  }, [state.submitOrdinal])

  function handleSubmit(e) {
    e.preventDefault()
    if (!hasErrors(state.result)) {
      dispatch({ type: "submitForm" })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-1 mb-3 my-sm-0">
      <div className="row align-items-center">
        <div className="col-sm mr-0 pr-sm-0 mb-2 mb-sm-0">
          <input onChange={e => dispatch({ type: "userChanged", value: e.target.value })} value={state.user} name="user" className={"form-control form-control-sm input-dark " + (hasError(state.result, "user") && "is-invalid")} type="text" placeholder="Username" autoComplete="off" />
        </div>
        <div className="col-sm mr-0 pr-sm-0 mb-2 mb-sm-0">
          <input onChange={e => dispatch({ type: "passwordChanged", value: e.target.value })} value={state.password} name="password" className={"form-control form-control-sm input-dark " + (hasError(state.result, "password") && "is-invalid")} type="password" placeholder="Password" autoComplete="off" />
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
    case "userChanged":
      deleteError(draft, "user")
      draft.user = action.value
      break
    case "passwordChanged":
      deleteError(draft, "password")
      draft.password = action.value
      break
    case "submitForm":
      notEmpty(draft.user, draft.result, "username")
      notEmpty(draft.password, draft.result, "password")
      if (!hasErrors(draft.result)) {
        draft.submitOrdinal++
      }
      break
  }
}
