import React, { useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Tooltip } from "react-tooltip"

import useAuth from "../hooks/useAuth"

export default function HeaderLoggedIn() {
  const auth = useAuth()
  const navigate = useNavigate()

  const isAdmin = auth.currentUser.groups.includes("admin")
  const title = `Manage ${isAdmin ? "User" : "My"} Profile`

  const onLogout = useCallback(() => {
    auth.logout()
    auth.on("logout success", () => {
      navigate("/", { replace: true })
    })
  }, [])

  return (
    <div className="mt-1 mb-3 my-sm-0 ml-sm-auto">
      {isAdmin && (
        <>
          <Link to="/users" data-tooltip-content="Manage All Users" data-tooltip-id="users-tooltip" className="text-white mr-2 header-icon">
            <i className="fas fa-users"></i>
          </Link>
          <Tooltip place="bottom" id="users-tooltip" className="custom-tooltip" />{" "}
        </>
      )}
      <Link to="/user" data-tooltip-content={title} data-tooltip-id="profile-tooltip" className="text-white mr-2 header-icon">
        <i className="fas fa-user-circle mr-1"></i>
        <span>{auth.currentUser.username}</span>
      </Link>
      <Tooltip place="bottom" id="profile-tooltip" className="custom-tooltip" />{" "}
      <Link onClick={onLogout} data-tooltip-content="Logout" data-tooltip-id="login-tooltip" className="text-white header-icon">
        <i className="fas fa-sign-out-alt"></i>
      </Link>
      <Tooltip place="bottom" id="login-tooltip" className="custom-tooltip" />
    </div>
  )
}
