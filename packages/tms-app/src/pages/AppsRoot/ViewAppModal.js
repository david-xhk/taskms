import React from "react"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"
import Row from "react-bootstrap/Row"
import Stack from "react-bootstrap/Stack"

import GroupSelector from "src/components/GroupSelector"
import useAppsContext from "src/contexts/AppsContext/useAppsContext"

export default function ViewAppModal() {
  const { state, modalOpen, selectedApp, onCancelViewApp } = useAppsContext()

  return (
    <Modal size="lg" show={modalOpen && state === "view app" && selectedApp} onHide={onCancelViewApp}>
      <Modal.Header closeButton>
        <Modal.Title>
          <strong>{selectedApp?.projectName ?? ""}</strong> Application
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack direction="vertical" gap={2}>
            <Row>
              <Form.Group controlId="formGroupAppAcronym" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">App Acronym</Form.Label>
                <Form.Control plaintext readOnly value={selectedApp?.projectName ?? ""} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupAppStartRNum" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">App Start RNum</Form.Label>
                <Form.Control plaintext readOnly value={selectedApp ? selectedApp.runningNum - selectedApp.numTasks : 0} />
              </Form.Group>
              <Form.Group controlId="formGroupAppCurrentRNum" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">App Current RNum</Form.Label>
                <Form.Control plaintext readOnly value={selectedApp?.runningNum ?? 0} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupAppPermitCreate" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">App Permit Create</Form.Label>
                <GroupSelector plaintext readOnly value={selectedApp?.permit.create ?? []} />
              </Form.Group>
              <Form.Group controlId="formGroupAppPermitOpen" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">App Permit Open</Form.Label>
                <GroupSelector plaintext readOnly value={selectedApp?.permit.open ?? []} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupAppPermitTodo" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">App Permit Todo</Form.Label>
                <GroupSelector plaintext readOnly value={selectedApp?.permit.todo ?? []} />
              </Form.Group>
              <Form.Group controlId="formGroupAppPermitDoing" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">App Permit Doing</Form.Label>
                <GroupSelector plaintext readOnly value={selectedApp?.permit.doing ?? []} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupAppPermitDone" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">App Permit Done</Form.Label>
                <GroupSelector plaintext readOnly value={selectedApp?.permit.done ?? []} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupAppStartDate" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">App Start Date</Form.Label>
                {selectedApp && selectedApp.startDate && <Form.Control plaintext readOnly value={selectedApp.startDate.toDateString()} />}
                {!(selectedApp && selectedApp.startDate) && <Form.Control plaintext readOnly className="text-muted" placeholder="null" value="" />}
              </Form.Group>
              <Form.Group controlId="formGroupAppEndDate" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">App End Date</Form.Label>
                {selectedApp && selectedApp.endDate && <Form.Control plaintext readOnly value={selectedApp.endDate.toDateString()} />}
                {!(selectedApp && selectedApp.endDate) && <Form.Control plaintext readOnly className="text-muted" placeholder="null" value="" />}
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupAppDescription" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">App Description</Form.Label>
                {selectedApp && selectedApp.description && <Form.Control plaintext readOnly as="textarea" rows={Math.min(Math.floor(selectedApp.description.length / 90), 9)} value={selectedApp.description} />}
                {!(selectedApp && selectedApp.description) && <Form.Control plaintext readOnly as="textarea" rows={2} className="text-muted" value="null" />}
              </Form.Group>
            </Row>
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
