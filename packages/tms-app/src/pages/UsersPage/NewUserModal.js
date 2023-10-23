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

export default function NewUserModal(props) {
  const { show, onHide, newUserForm, onSubmit, groups, newGroupForm, onNewGroup } = props

  const onKeyDown = /** @type {React.KeyboardEventHandler<HTMLDivElement>} */ event => {
    if (event.key === "Escape") {
      onHide()
    } else if (event.key === "Enter") {
      if (newUserForm.allowSubmit) {
        onSubmit()
      }
    }
  }

  return (
    <Modal size="lg" show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          New <strong>User</strong>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body onKeyDown={onKeyDown}>
        <Form>
          <Stack direction="vertical" gap={2}>
            <Row>
              <Form.Group controlId="formGroupUsername" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Username (Required)</Form.Label>
                <ValidationError offset="20px" visible={newUserForm.hasError("username")}>
                  {newUserForm.getError("username")}
                </ValidationError>
                <Form.Control placeholder="Alphabets or digits only" type="search" autoComplete="off" autoFocus value={newUserForm.username.value} onChange={newUserForm.username.onChange} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupPassword" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Password (Required)</Form.Label>
                <ValidationError offset="20px" visible={newUserForm.hasError("password")}>
                  {newUserForm.getError("password")}
                </ValidationError>
                <Form.Control placeholder="Alphabets, digits, and special only" type="password" autoComplete="off" value={newUserForm.password.value} onChange={newUserForm.password.onChange} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupEmail" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Email</Form.Label>
                <ValidationError offset="20px" visible={newUserForm.hasError("email")}>
                  {newUserForm.getError("email")}
                </ValidationError>
                <Form.Control placeholder="Valid email address" type="search" autoComplete="off" value={newUserForm.email.value ?? ""} onChange={newUserForm.email.onChange} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupActive" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Active</Form.Label>
                <ToggleButton icons={{ checked: "🟢", unchecked: "⛔️" }} checked={newUserForm.active.value} onChange={newUserForm.active.onChange} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupGroups" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Groups</Form.Label>
                <ValidationError offset="20px" visible={newGroupForm.hasError("group")}>
                  {newGroupForm.getError("group")}
                </ValidationError>
                <GroupSelector placeholder="Select groups" allowNew allowCreate={newGroupForm.allowSubmit} onCreate={onNewGroup} onInput={newGroupForm.group.onChange} groups={groups} value={newUserForm.groups.value} onChange={newUserForm.groups.onChange} />
              </Form.Group>
            </Row>
          </Stack>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" variant={!newUserForm.allowSubmit ? "outline-primary" : "primary"} onClick={onSubmit} disabled={!newUserForm.allowSubmit}>
          Create User
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
