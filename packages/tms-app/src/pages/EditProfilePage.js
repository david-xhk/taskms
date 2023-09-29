import React, { useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"

import GroupSelector from "../components/GroupSelector.js"
import NotAuthorized from "../components/NotAuthorized.js"
import NotFound from "../components/NotFound.js"
import Small from "../components/Small.js"
import ValidationError from "../components/ValidationError.js"
import useAuth from "../hooks/useAuth.js"
import useEditProfile from "../hooks/useEditProfile.js"
import ProtectedPage from "./ProtectedPage.js"

const ToggleButton = React.lazy(() => import("react-toggle").then(mod => mod.default))

export default function EditProfilePage() {
  const auth = useAuth()
  const navigate = useNavigate()

  const username = auth.currentUser?.username ?? ""
  const isAdmin = auth.currentUser?.groups.includes("admin")

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
            <Link to="#" onClick={onBack}>
              <i className="fas fa-arrow-circle-left mr-1"></i>
              <span>Back</span>
            </Link>
            <Link to="#" onClick={() => form.refresh(true)}>
              <i className="fas fa-sync-alt mr-1"></i>
              <span>Refresh</span>
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
              <input onChange={form.onUsernameChanged} value={username} disabled name="user" id="user-input" className="form-control form-control-lg" type="text" placeholder="Select Username" autoComplete="off" />
              <ValidationError visible={form.hasUsernameError}>{form.userError}</ValidationError>
            </div>
            <div className="form-group mb-4">
              <label htmlFor="email-input" className="text-muted mb-2">
                <small>Email</small>
              </label>
              <input onChange={form.onEmailChanged} value={form.email} autoFocus name="email" id="email-input" className="form-control form-control-lg" type="search" placeholder="Enter New Email" autoComplete="off" />
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
              <Small className={!isAdmin ? "text-muted" : form.changes.active === false ? "text-danger" : null} visible={!isAdmin || form.changes.active === false}>
                {!isAdmin ? "Users cannot change their active status." : form.changes.active === false ? "Warning: You will no longer have access to the system." : null}
              </Small>
            </div>
            <div className="form-group mb-4">
              <label htmlFor="groups-input" className="text-muted mb-2">
                <small>Groups</small>
              </label>
              <GroupSelector value={form.groups} onChange={form.onGroupsChanged} onInput={form.onGroupChanged} onError={form.onErrors} name="groups" id="groups-input" placeholder="Change Groups" disabled={!isAdmin} />
              <ValidationError visible={form.hasGroupsError}>{form.groupsError}</ValidationError>
              <Small className={!isAdmin ? "text-muted" : form.changes.groups && !form.changes.groups.includes("admin") ? "text-danger" : null} visible={!isAdmin || (form.changes.groups && !form.changes.groups.includes("admin"))}>
                {!isAdmin ? "Users cannot change their groups." : form.changes.groups && !form.changes.groups.includes("admin") ? "Warning: You will no longer be an admin." : null}
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
