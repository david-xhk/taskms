import React, { useEffect, useState } from "react"
import { useMediaQuery } from "react-responsive"

import Header from "src/components/Header"
import Table from "src/components/Table"
import useAuth from "src/contexts/AuthContext/useAuth"
import useFlashMessage from "src/contexts/FlashMessageContext/useFlashMessage"
import useToggleActiveUser from "src/hooks/apiHooks/useToggleActiveUser"
import useGroups from "src/hooks/dataHooks/useGroups"
import useUsers from "src/hooks/dataHooks/useUsers"
import useEditUser from "src/hooks/formHooks/useEditUser"
import useNewGroup from "src/hooks/formHooks/useNewGroup"
import useNewUser from "src/hooks/formHooks/useNewUser"
import useEffectOnSync from "src/hooks/useEffectOnSync"
import ProtectedPage from "src/pages/ProtectedPage"

import EditUserModal from "./EditUserModal"
import EditUserTableRow from "./EditUserTableRow"
import NewUserModal from "./NewUserModal"
import NewUserTableRow from "./NewUserTableRow"
import ViewUserModal from "./ViewUserModal"
import ViewUserTableRow from "./ViewUserTableRow"

export default function UsersPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [openModal, setOpenModal] = useState(/** @type {"new" | "view" | "edit" | null} */ (null))
  const [selectedUser, setSelectedUser] = useState(/** @type {import("@han-keong/tms-types/User").default?} */ (null))

  const auth = useAuth()
  const users = useUsers()
  const groups = useGroups()
  const newUserForm = useNewUser()
  const editUserForm = useEditUser({ user: selectedUser })
  const newGroupForm = useNewGroup()
  const flashMessage = useFlashMessage()
  const toggleActiveUser = useToggleActiveUser()
  const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" })

  const hasRows = users.data && users.data.length > 0

  useEffectOnSync(async () => {
    if (auth.isLoggedIn && auth.isAdmin && !openModal) {
      if (!(await users.fetch())) {
        return
      }
      groups.fetch()
    }
  }, [auth.isLoggedIn, auth.isAdmin])

  useEffect(() => {
    editUserForm.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser])

  const onOpenModal = modal => {
    if (openModal !== modal && openModal === "new") {
      onCancelNewUser()
    }
    if (openModal !== modal && openModal === "view") {
      onCancelViewUser()
    }
    if (openModal !== modal && openModal === "edit") {
      onCancelEditUser()
    }
    setOpenModal(modal)
  }

  const onNewUser = async () => {
    if (!(await auth.checkAdmin())) {
      return
    }
    if (isSmallScreen) {
      onOpenModal("new")
    } else {
      if (isEditing) {
        onCancelEditUser()
      }
      setIsCreating(true)
    }
  }

  const onCancelNewUser = (stopCreating = true) => {
    if (isSmallScreen) {
      setOpenModal(null)
    } else if (stopCreating) {
      setIsCreating(false)
    }
    newUserForm.reset()
    newGroupForm.reset()
  }

  const onConfirmNewUser = async () => {
    if (!(await auth.checkAdmin())) {
      return
    }
    if (!(await newUserForm.submit())) {
      return
    }
    if (await onReload()) {
      onCancelNewUser(false)
      flashMessage("User account created!", "success")
    }
  }

  const onViewUser = async user => {
    if (!(await auth.checkAdmin())) {
      return
    }
    setSelectedUser(user)
    setTimeout(() => onOpenModal("view"))
  }

  const onCancelViewUser = () => {
    setOpenModal(null)
    setTimeout(() => setSelectedUser(null))
  }

  const onEditUser = async user => {
    if (!(await auth.checkAdmin())) {
      return
    }
    setSelectedUser(user)
    if (isSmallScreen) {
      setTimeout(() => onOpenModal("edit"))
    } else {
      if (isCreating) {
        onCancelNewUser()
      }
      setIsEditing(true)
    }
  }

  const onCancelEditUser = () => {
    if (isSmallScreen) {
      setOpenModal(null)
    } else {
      setIsEditing(false)
    }
    setTimeout(() => setSelectedUser(null))
    editUserForm.reset()
    newGroupForm.reset()
  }

  const onConfirmEditUser = async () => {
    if (!(await auth.checkAdmin())) {
      return
    }
    if (!(await editUserForm.submit())) {
      return
    }
    if (await onReload()) {
      onCancelEditUser()
      flashMessage("User account updated!", "success")
    }
  }

  const onToggleActiveUser = async user => {
    if (!(await auth.checkAdmin())) {
      return
    }
    if (!(await toggleActiveUser(user))) {
      return
    }
    if (await onReload()) {
      flashMessage(`User account ${user.active ? "de" : ""}activated!`, "success")
    }
  }

  const onNewGroup = async () => {
    if (!(await auth.checkAdmin())) {
      return
    }
    if (!(await newGroupForm.submit())) {
      return
    }
    if (await groups.fetch()) {
      flashMessage("New group created!", "success")
    }
  }

  const onReload = async () => {
    if (!(await auth.checkAdmin())) {
      return
    }
    if (!(await users.fetch())) {
      return
    }
    return true
  }

  const onRefresh = async () => {
    if (await onReload()) {
      flashMessage("Users have been refreshed.", "info")
    }
  }

  return (
    <ProtectedPage title="Users" authorization="admin" isLoading={users.isFetching}>
      <Header>
        <Header.Title>
          <strong>Users</strong>
        </Header.Title>
        <Header.ButtonGroup>
          <Header.Button name="Create New User" icon="fas fa-plus" onClick={onNewUser} disabled={isCreating} />
          <Header.Button name="Refresh Users" icon="fas fa-sync-alt" onClick={onRefresh} />
        </Header.ButtonGroup>
      </Header>
      <Table columns="Username,Password,Email,Active,Groups,Actions">
        {isCreating && <NewUserTableRow newUserForm={newUserForm} onCancel={onCancelNewUser} onConfirm={onConfirmNewUser} groups={groups.data} newGroupForm={newGroupForm} onNewGroup={onNewGroup} />}
        {hasRows &&
          users.data.map((user, index) => {
            if (isEditing && selectedUser && selectedUser.username === user.username) {
              return <EditUserTableRow user={user} editUserForm={editUserForm} onCancel={onCancelEditUser} onConfirm={onConfirmEditUser} groups={groups.data} newGroupForm={newGroupForm} onNewGroup={onNewGroup} key={index} />
            } else {
              return <ViewUserTableRow user={user} onView={() => onViewUser(user)} onEdit={() => onEditUser(user)} onToggleActiveUser={() => onToggleActiveUser(user)} key={index} />
            }
          })}
        {!isCreating && !hasRows && (
          <Table.Row>
            <Table.Cell colSpan={6} style={{ padding: "11px 3px" }}>
              <span className="text-muted">No users found.</span>
            </Table.Cell>
          </Table.Row>
        )}
      </Table>
      <NewUserModal show={openModal === "new"} onHide={onCancelNewUser} newUserForm={newUserForm} onSubmit={onConfirmNewUser} groups={groups.data} newGroupForm={newGroupForm} onNewGroup={onNewGroup} />
      <ViewUserModal show={openModal === "view" && selectedUser} onHide={onCancelViewUser} user={selectedUser} />
      <EditUserModal show={openModal === "edit" && selectedUser} onHide={onCancelEditUser} user={selectedUser} editUserForm={editUserForm} onSubmit={onConfirmEditUser} groups={groups.data} newGroupForm={newGroupForm} onNewGroup={onNewGroup} />
    </ProtectedPage>
  )
}
