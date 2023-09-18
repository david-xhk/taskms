import React from "react"
import { Link, useNavigate } from "react-router-dom"

import { truncate } from "tms-all/helpers/stringHelper"

import useUsersTable from "../hooks/useUsersTable"
import ProtectedPage from "./ProtectedPage"

export default function ManageUsersPage() {
  const table = useUsersTable()
  const navigate = useNavigate()

  return (
    <ProtectedPage title="Manage Users" authorization={["admin"]}>
      <div className="d-flex align-items-center justify-content-between">
        <Link to="/users/new">
          <i className="fas fa-user-plus mr-1"></i>
          <span>Create Profile</span>
        </Link>
        <Link onClick={() => table.refresh(true)}>
          <i className="fas fa-sync-alt mr-1"></i>
          <span>Refresh</span>
        </Link>
        <Link onClick={() => navigate(1)}>
          <i className="fas fa-arrow-circle-right mr-1"></i>
          <span>Forward</span>
        </Link>
      </div>
      <div className="table-responsive my-4">
        <table className="table table-sm table-hover border-light">
          <thead className="border-light">
            <tr>
              <th scope="col">
                <strong>Username</strong>
              </th>
              <th scope="col">
                <strong>Email</strong>
              </th>
              <th scope="col">
                <strong>Active</strong>
              </th>
              <th scope="col">
                <strong>Groups</strong>
              </th>
            </tr>
          </thead>
          <tbody>
            {table.users.map((user, index) => (
              <tr key={index} className="position-relative">
                <th scope="row">
                  <Link to={`/user/${user.username}`} className="stretched-link">
                    {user.username}
                  </Link>
                </th>
                <td>{truncate(user.email, 30)}</td>
                <td>{user.active ? "🟢" : "⛔️"}</td>
                <td>
                  {user.groups.map((group, index) => (
                    <span className={`badge badge-pill ${group === "admin" ? "badge-primary" : "badge-light"}`} key={index}>
                      {truncate(group, 10)}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ProtectedPage>
  )
}
