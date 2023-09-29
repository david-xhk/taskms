import React, { useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"

import GroupSelector from "../components/GroupSelector.js"
import Small from "../components/Small.js"
import ValidationError from "../components/ValidationError.js"
import useAuth from "../hooks/useAuth.js"
import useCreateProfile from "../hooks/useCreateProfile.js"
import ProtectedPage from "./ProtectedPage.js"

const ToggleButton = React.lazy(() => import("react-toggle").then(mod => mod.default))

export default function EditProfilePage() {
  const auth = useAuth()
  const form = useCreateProfile()
  const navigate = useNavigate()

  const onBack = useCallback(function onBack() {
    auth.cancelAll()
    form.reset()
    navigate(-1)
    auth.checkAuth()
  }, [])

  return (
    <ProtectedPage title="Create Profile" authorization={["admin"]}>
      <div className="d-flex align-items-center justify-content-between">
        <Link to="#" onClick={onBack}>
          <i className="fas fa-arrow-circle-left mr-1"></i>
          <span>Back</span>
        </Link>
        <Link to="#" onClick={() => form.reset(true)}>
          <i className="fas fa-undo-alt mr-1"></i>
          <span>Reset</span>
        </Link>
      </div>
      <form className="my-4" onSubmit={form.handleSubmit}>
        <div className="form-group mb-4">
          <label htmlFor="user-input" className="text-muted mb-2">
            <small>Username</small>
          </label>
          <input onChange={form.onUsernameChanged} value={form.user} name="user" id="user-input" autoFocus className="form-control form-control-lg" type="search" placeholder="Enter Username" autoComplete="off" />
          <ValidationError visible={form.hasUsernameError}>{form.userError}</ValidationError>
        </div>
        <div className="form-group mb-4">
          <label htmlFor="email-input" className="text-muted mb-2">
            <small>Email</small>
          </label>
          <input onChange={form.onEmailChanged} value={form.email} name="email" id="email-input" className="form-control form-control-lg" type="search" placeholder="Enter Email" autoComplete="off" />
          <ValidationError visible={form.hasEmailError}>{form.emailError}</ValidationError>
        </div>
        <div className="form-group mb-4">
          <label htmlFor="password-input" className="text-muted mb-2">
            <small>Password</small>
          </label>
          <input onChange={form.onPasswordChanged} value={form.password} name="password" id="password-input" className="form-control form-control-lg" type="password" placeholder="Enter Password" autoComplete="off" />
          <ValidationError visible={form.hasPasswordError}>{form.passwordError}</ValidationError>
        </div>
        <div className="form-group mb-4">
          <label htmlFor="active-input" className="text-muted mb-2">
            <small>Active</small>
          </label>
          <ToggleButton checked={form.active} onChange={e => form.onActiveChanged(e.target.checked)} name="active" id="active-input" icons={false} />
        </div>
        <div className="form-group mb-4">
          <label htmlFor="groups-input" className="text-muted mb-2">
            <small>Groups</small>
          </label>
          <GroupSelector value={form.groups} onChange={form.onGroupsChanged} onInput={form.onGroupChanged} onError={form.onErrors} name="groups" id="groups-input" placeholder="Enter Groups" />
          <ValidationError visible={form.hasGroupsError}>{form.groupsError}</ValidationError>
        </div>
        <button className="btn btn-primary" type="submit" disabled={!form.allowSubmit}>
          Create Profile
        </button>
        <Small className="text-muted ml-2 ellipsis-loading" visible={form.showStatus}>
          {form.status}
        </Small>
      </form>
    </ProtectedPage>
  )
}
