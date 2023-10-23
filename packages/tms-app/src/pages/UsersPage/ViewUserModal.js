import React from "react"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"
import Row from "react-bootstrap/Row"
import Stack from "react-bootstrap/Stack"
import ToggleButton from "react-toggle"

import GroupSelector from "src/components/GroupSelector"

export default function ViewUserModal(props) {
  const { show, onHide, user } = props

  return (
    <Modal size="lg" show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          <strong>{user?.username ?? ""}</strong> User
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
                <Form.Control plaintext readOnly value="..." />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupEmail" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Email</Form.Label>
                {user && user.email && <Form.Control plaintext readOnly value={user.email} />}
                {!(user && user.email) && <Form.Control plaintext readOnly value="null" className="text-muted" />}
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupActive" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Active</Form.Label>
                <ToggleButton icons={{ checked: "🟢", unchecked: "⛔️" }} checked={user?.active ?? false} disabled />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupGroups" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Groups</Form.Label>
                <GroupSelector plaintext readOnly value={user?.groups ?? []} />
              </Form.Group>
            </Row>
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
