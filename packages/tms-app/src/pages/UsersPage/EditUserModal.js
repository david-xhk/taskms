import React from "react"
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"
import Row from "react-bootstrap/Row"
import Stack from "react-bootstrap/Stack"
import ToggleButton from "react-toggle"

import GroupSelector from "src/components/GroupSelector"
import ValidationError from "src/components/ValidationError"

export default function EditUserModal(props) {
  const { show, onHide, user, editUserForm, onSubmit, groups, newGroupForm, onNewGroup } = props

  const onKeyDown = /** @type {React.KeyboardEventHandler<HTMLDivElement>} */ event => {
    if (event.key === "Escape") {
      onHide()
    } else if (event.key === "Enter") {
      if (editUserForm.allowSubmit) {
        onSubmit()
      }
    }
  }

  return (
    <Modal size="lg" show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          Update <strong>{user?.username ?? ""}</strong> User
        </Modal.Title>
      </Modal.Header>
      <Modal.Body onKeyDown={onKeyDown}>
        <Form>
          <Stack direction="vertical" gap={2}>
            <Row>
              <Form.Group controlId="formGroupUsername" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Username</Form.Label>
                <Form.Control plaintext readOnly value={user?.username ?? ""} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupPassword" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Password</Form.Label>
                <ValidationError offset="20px" visible={editUserForm.hasError("password")}>
                  {editUserForm.getError("password")}
                </ValidationError>
                <Form.Control placeholder="Alphabets, digits, and special only" type="password" autoComplete="off" value={editUserForm.password.value} onChange={editUserForm.password.onChange} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupEmail" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Email</Form.Label>
                <ValidationError offset="20px" visible={editUserForm.hasError("email")}>
                  {editUserForm.getError("email")}
                </ValidationError>
                <Form.Control placeholder="Valid email address" type="search" autoComplete="off" value={editUserForm.email.value ?? ""} onChange={editUserForm.email.onChange} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupActive" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Active</Form.Label>
                <ToggleButton icons={{ checked: "🟢", unchecked: "⛔️" }} checked={editUserForm.active.value} onChange={editUserForm.active.onChange} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupGroups" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Groups</Form.Label>
                <ValidationError offset="20px" visible={newGroupForm.hasError("group")}>
                  {newGroupForm.getError("group")}
                </ValidationError>
                <GroupSelector placeholder="Select groups" allowNew allowCreate={newGroupForm.allowSubmit} onCreate={onNewGroup} onInput={newGroupForm.group.onChange} groups={groups} value={editUserForm.groups.value} onChange={editUserForm.groups.onChange} />
              </Form.Group>
            </Row>
          </Stack>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant={!editUserForm.allowSubmit ? "outline-primary" : "primary"} onClick={onSubmit} disabled={!editUserForm.allowSubmit}>
          Update User
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
