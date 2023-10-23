import React from "react"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"
import Row from "react-bootstrap/Row"
import Stack from "react-bootstrap/Stack"

import useAppsContext from "src/contexts/AppsContext/useAppsContext"

export default function ViewPlanModal() {
  const { state, modalOpen, selectedPlan, onCancelViewPlan } = useAppsContext()

  return (
    <Modal size="lg" show={modalOpen && state === "view plan" && selectedPlan} onHide={onCancelViewPlan}>
      <Modal.Header closeButton>
        <Modal.Title>
          <strong>
            {selectedPlan?.project ?? ""} {selectedPlan?.planName ?? ""}
          </strong>{" "}
          Plan
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack direction="vertical" gap={2}>
            <Row>
              <Form.Group controlId="formGroupPlanMVPName" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Plan MVP Name</Form.Label>
                <Form.Control plaintext readOnly value={selectedPlan?.planName ?? ""} />
              </Form.Group>
              <Form.Group controlId="formGroupPlanAppAcronym" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Plan App Acronym</Form.Label>
                <Form.Control plaintext readOnly value={selectedPlan?.project ?? ""} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupPlanColour" className="position-relative" as={Col} xs="auto">
                <Form.Label className="text-muted small mb-0">Plan Colour</Form.Label>
                <Form.Control plaintext readOnly type="color" value={selectedPlan?.colour ?? ""} className="border rounded-3" />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupPlanStartDate" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Plan Start Date</Form.Label>
                {selectedPlan && selectedPlan.startDate && <Form.Control plaintext readOnly value={selectedPlan.startDate.toDateString()} />}
                {!(selectedPlan && selectedPlan.startDate) && <Form.Control plaintext readOnly className="text-muted" placeholder="null" value="" />}
              </Form.Group>
              <Form.Group controlId="formGroupPlanEndDate" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Plan End Date</Form.Label>
                {selectedPlan && selectedPlan.endDate && <Form.Control plaintext readOnly value={selectedPlan.endDate.toDateString()} />}
                {!(selectedPlan && selectedPlan.endDate) && <Form.Control plaintext readOnly className="text-muted" placeholder="null" value="" />}
              </Form.Group>
            </Row>
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
