import React, { useEffect } from "react"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Stack from "react-bootstrap/Stack"
import ToggleButton from "react-toggle"

import GroupSelector from "src/components/GroupSelector"
import Header from "src/components/Header"
import Small from "src/components/Small"
import ValidationError from "src/components/ValidationError"
import useAuth from "src/contexts/AuthContext/useAuth"
import useFlashMessage from "src/contexts/FlashMessageContext/useFlashMessage"
import useGroups from "src/hooks/dataHooks/useGroups"
import useEditUser from "src/hooks/formHooks/useEditUser"
import useNewGroup from "src/hooks/formHooks/useNewGroup"
import useEffectOnSync from "src/hooks/useEffectOnSync"

import ProtectedPage from "./ProtectedPage"

export default function AccountPage() {
  const auth = useAuth()
  const groups = useGroups()
  const editUserForm = useEditUser({ user: auth.currentUser, isCurrentUser: true })
  const newGroupForm = useNewGroup()
  const flashMessage = useFlashMessage()

  useEffectOnSync(() => {
    if (auth.isLoggedIn && auth.isAdmin) {
      groups.fetch()
    }
  }, [auth.isLoggedIn])

  useEffect(() => {
    editUserForm.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.currentUser?.username])

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

  /** @type {(event: React.FormEvent<HTMLFormElement>) => Promise<void>} */
  const onSubmit = async event => {
    event.preventDefault()
    if (!(await auth.checkUser())) {
      return
    }
    if (!(await editUserForm.submit())) {
      return
    }
    if (await auth.checkUser()) {
      editUserForm.reset(true)
      flashMessage("Your account has been updated!", "success")
    }
  }

  const onReset = () => {
    editUserForm.reset()
    newGroupForm.reset()
    flashMessage("Form fields have been reset.", "info")
  }

  return (
    <ProtectedPage title="My Account">
      <Header>
        <Header.Title>
          My <strong>Account</strong>
        </Header.Title>
        <Header.ButtonGroup>
          <Header.Button name="Reset" icon="fas fa-undo-alt" onClick={onReset} />
        </Header.ButtonGroup>
      </Header>
      <Form onSubmit={onSubmit}>
        <Stack direction="vertical" gap={2}>
          <Form.Group controlId="formGroupUsername" className="position-relative">
            <Form.Label className="text-muted small mb-0">Username</Form.Label>
            <Form.Control plaintext readOnly value={auth.currentUser?.username ?? ""} />
          </Form.Group>
          <Form.Group controlId="formGroupPassword" className="position-relative">
            <Form.Label className="text-muted small mb-0">New Password</Form.Label>
            <ValidationError offset="20px" visible={editUserForm.hasError("password")}>
              {editUserForm.getError("password")}
            </ValidationError>
            <Form.Control placeholder="Alphabets, digits, and special only" type="password" autoComplete="off" value={editUserForm.password.value} onChange={editUserForm.password.onChange} />
          </Form.Group>
          <Form.Group controlId="formGroupEmail" className="position-relative">
            <Form.Label className="text-muted small mb-0">Email</Form.Label>
            <ValidationError offset="20px" visible={editUserForm.hasError("email")}>
              {editUserForm.getError("email")}
            </ValidationError>
            <Form.Control placeholder="Valid email address" type="search" autoComplete="off" value={editUserForm.email.value ?? ""} onChange={editUserForm.email.onChange} />
          </Form.Group>
          {!auth.isAdmin ? (
            <Form.Group controlId="formGroupGroups" className="position-relative">
              <Form.Label className="text-muted small mb-0">Groups</Form.Label>
              <GroupSelector plaintext readOnly value={editUserForm.groups.value} />
            </Form.Group>
          ) : (
            <>
              <Form.Group controlId="formGroupActive" className="position-relative">
                <Form.Label className="text-muted small mb-0">Active</Form.Label>
                <ToggleButton icons={{ checked: "🟢", unchecked: "⛔️" }} checked={editUserForm.active.value} onChange={editUserForm.active.onChange} />
                <Form.Text className="text-danger" as={Small} visible={editUserForm.data.active === false}>
                  Warning: You will no longer have access to the system.
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="formGroupGroups" className="position-relative">
                <Form.Label className="text-muted small mb-0">Groups</Form.Label>
                <ValidationError offset="20px" visible={newGroupForm.hasError("group")}>
                  {newGroupForm.getError("group")}
                </ValidationError>
                <GroupSelector placeholder="Select groups" allowNew={auth.isAdmin} allowCreate={newGroupForm.allowSubmit} onCreate={onNewGroup} onInput={newGroupForm.group.onChange} groups={groups.data} value={editUserForm.groups.value} onChange={editUserForm.groups.onChange} />
                <Form.Text className="text-danger" as={Small} visible={editUserForm.data.groups ? !editUserForm.data.groups.includes("admin") : false}>
                  Warning: You will no longer be an admin.
                </Form.Text>
              </Form.Group>
            </>
          )}
        </Stack>
        <Button type="submit" variant={!editUserForm.allowSubmit ? "outline-primary" : "primary"} className="my-3" disabled={!editUserForm.allowSubmit}>
          Update Account
        </Button>
      </Form>
    </ProtectedPage>
  )
}
