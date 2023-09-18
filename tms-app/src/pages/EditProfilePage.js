import React, { useCallback } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import ToggleButton from "react-toggle"

import GroupSelector from "../components/GroupSelector"
import NotAuthorized from "../components/NotAuthorized"
import NotFound from "../components/NotFound"
import Small from "../components/Small"
import ValidationError from "../components/ValidationError"
import useAuth from "../hooks/useAuth"
import useEditProfile from "../hooks/useEditProfile"
import ProtectedPage from "./ProtectedPage"

export default function EditProfilePage() {
  const auth = useAuth()
  const urlParams = useParams()
  const navigate = useNavigate()

  const username = urlParams.username ?? auth.currentUser?.username ?? ""
  const isAdmin = auth.currentUser?.groups.includes("admin")
  const isCurrentUser = username && username == auth.currentUser?.username

  const form = useEditProfile(username)

  const onBack = useCallback(function onBack() {
    auth.cancelAll()
    form.reset()
    navigate(-1)
    auth.checkAuth()
  }, [])

  return (
    <ProtectedPage title="Edit Profile">
      {form.notFound ? (
        <NotFound page />
      ) : form.notAuthorized ? (
        <NotAuthorized page />
      ) : (
        <>
          <div className="d-flex align-items-center justify-content-between">
            <Link onClick={onBack}>
              <i className="fas fa-arrow-circle-left mr-1"></i>
              <span>Back</span>
            </Link>
            <Link onClick={() => form.refresh(true)}>
              <i className="fas fa-sync-alt mr-1"></i>
              <span>Refresh</span>
            </Link>
            <Link onClick={() => form.reset(true)}>
              <i className="fas fa-undo-alt mr-1"></i>
              <span>Reset</span>
            </Link>
          </div>
          <form className="my-4" onSubmit={form.handleSubmit}>
            <div className="form-group mb-4">
              <label htmlFor="username-input" className="text-muted mb-2">
                <small>Username</small>
              </label>
              <input onChange={form.onUsernameChanged} value={username} disabled name="username" id="username-input" className="form-control form-control-lg" type="text" placeholder="Select Username" autoComplete="off" />
              <ValidationError visible={form.hasUsernameError}>{form.usernameError}</ValidationError>
            </div>
            <div className="form-group mb-4">
              <label htmlFor="email-input" className="text-muted mb-2">
                <small>Email</small>
              </label>
              <input onChange={form.onEmailChanged} onBlur={e => !e.target.value && form.onEmailChanged(form.original.email)} value={form.email} autoFocus name="email" id="email-input" className="form-control form-control-lg" type="text" placeholder="Enter New Email" autoComplete="off" />
              <ValidationError visible={form.hasEmailError}>{form.emailError}</ValidationError>
            </div>
            <div className="form-group mb-4">
              <label htmlFor="password-input" className="text-muted mb-2">
                <small>Password</small>
              </label>
              <input onChange={form.onPasswordChanged} value={form.password} name="password" id="password-input" className="form-control form-control-lg" type="password" placeholder="Enter New Password" autoComplete="off" />
              <ValidationError visible={form.hasPasswordError}>{form.passwordError}</ValidationError>
            </div>
            <div className="form-group mb-4">
              <label htmlFor="active-input" className="text-muted mb-2">
                <small>Active</small>
              </label>
              <ToggleButton checked={form.active} onChange={e => form.onActiveChanged(e.target.checked)} name="active" id="active-input" icons={false} disabled={!isAdmin} />
              <Small className={!isAdmin ? "text-muted" : isCurrentUser && form.changes.active === false ? "text-danger" : null} visible={!isAdmin || (isCurrentUser && form.changes.active === false)}>
                {!isAdmin ? "Users cannot change their active status." : isCurrentUser && form.changes.active === false ? "Warning: You will no longer have access to the system." : null}
              </Small>
            </div>
            <div className="form-group mb-4">
              <label htmlFor="groups-input" className="text-muted mb-2">
                <small>Groups</small>
              </label>
              <GroupSelector value={form.groups} onChange={form.onGroupsChanged} onInput={form.onGroupChanged} onError={form.onErrors} name="groups" id="groups-input" placeholder="Change Groups" disabled={!isAdmin} />
              <ValidationError visible={form.hasGroupsError}>{form.groupsError}</ValidationError>
              <Small className={!isAdmin ? "text-muted" : isCurrentUser && form.changes.groups && !form.changes.groups.includes("admin") ? "text-danger" : null} visible={!isAdmin || (isCurrentUser && form.changes.groups && !form.changes.groups.includes("admin"))}>
                {!isAdmin ? "Users cannot change their groups." : isCurrentUser && form.changes.groups && !form.changes.groups.includes("admin") ? "Warning: You will no longer be an admin." : null}
              </Small>
            </div>
            <button className="btn btn-primary" type="submit" disabled={!form.allowSubmit}>
              Update Profile
            </button>
            <Small className="text-muted ml-2 ellipsis-loading" visible={form.showStatus}>
              {form.status}
            </Small>
          </form>
        </>
      )}
    </ProtectedPage>
  )
}
