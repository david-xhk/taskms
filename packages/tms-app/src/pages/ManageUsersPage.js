import React from "react"
import { Link, useNavigate } from "react-router-dom"

import { truncate } from "@han-keong/tms-helpers/stringHelper"

import useUsersTable from "../hooks/useUsersTable.js"
import ProtectedPage from "./ProtectedPage.js"

export default function ManageUsersPage() {
  const table = useUsersTable()
  const navigate = useNavigate()

  return (
    <ProtectedPage title="Manage Users" authorization={["admin"]}>
      <h2 className="mb-4">User Management Page</h2>
      <div className="d-flex align-items-center justify-content-between">
        <Link to="/users/new">
          <i className="fas fa-user-plus mr-1"></i>
          <span>Create Profile</span>
        </Link>
        <Link to="#" onClick={() => table.refresh(true)}>
          <i className="fas fa-sync-alt mr-1"></i>
          <span>Refresh</span>
        </Link>
        <Link to="#" onClick={() => navigate(1)}>
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
                <td>{user.email ? truncate(user.email, 30) : <span className="text-muted">null</span>}</td>
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
