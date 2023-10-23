import React from "react"
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"
import Row from "react-bootstrap/Row"
import Stack from "react-bootstrap/Stack"

import { toYYYYMMDDDate } from "@han-keong/tms-helpers/dateHelper"

import ValidationError from "src/components/ValidationError"
import useAppsContext from "src/contexts/AppsContext/useAppsContext"
import useAuth from "src/contexts/AuthContext/useAuth"
import { onDateInputFocus } from "src/helpers/formHelper"

export default function NewPlanModal() {
  const { state, modalOpen, selectedApp, newPlanForm, onCancelNewPlan, onConfirmNewPlan } = useAppsContext()

  const auth = useAuth()

  return (
    <Modal size="lg" show={modalOpen && state === "new plan" && auth.isProjectManager} onHide={onCancelNewPlan}>
      <Modal.Header closeButton>
        <Modal.Title>
          New <strong>{selectedApp?.projectName ?? ""}</strong> Plan
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack direction="vertical" gap={2}>
            <Row>
              <Form.Group controlId="formGroupPlanMVPName" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Plan MVP Name (Required)</Form.Label>
                <ValidationError offset="20px" visible={newPlanForm.hasError("plan")}>
                  {newPlanForm.getError("plan")}
                </ValidationError>
                <Form.Control placeholder="Alphabets, digits, or dashes only" type="search" autoComplete="off" autoFocus value={newPlanForm.plan.value ?? ""} onChange={newPlanForm.plan.onChange} />
              </Form.Group>
              <Form.Group controlId="formGroupPlanAppAcronym" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Plan App Acronym</Form.Label>
                <Form.Control plaintext readOnly value={selectedApp?.projectName ?? ""} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupPlanColour" className="position-relative" as={Col} xs="auto">
                <Form.Label className="text-muted small mb-0">Plan Colour (Required)</Form.Label>
                <ValidationError offset="20px" visible={newPlanForm.hasError("colour")}>
                  {newPlanForm.getError("colour")}
                </ValidationError>
                <Form.Control type="color" value={newPlanForm.colour.value} onInput={newPlanForm.colour.onChange} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupPlanStartDate" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Plan Start Date</Form.Label>
                <ValidationError offset="20px" visible={newPlanForm.hasError("startDate")}>
                  {newPlanForm.getError("startDate")}
                </ValidationError>
                <Form.Control onFocus={onDateInputFocus} autoComplete="off" placeholder="Select date" value={newPlanForm.startDate.value ?? ""} onChange={newPlanForm.startDate.onChange} max={newPlanForm.endDate.value ? toYYYYMMDDDate(newPlanForm.endDate.value) : undefined} />
              </Form.Group>
              <Form.Group controlId="formGroupPlanEndDate" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Plan End Date</Form.Label>
                <ValidationError offset="20px" visible={newPlanForm.hasError("endDate")}>
                  {newPlanForm.getError("endDate")}
                </ValidationError>
                <Form.Control onFocus={onDateInputFocus} autoComplete="off" placeholder="Select date" value={newPlanForm.endDate.value ?? ""} onChange={newPlanForm.endDate.onChange} min={newPlanForm.startDate.value ? toYYYYMMDDDate(newPlanForm.startDate.value) : undefined} />
              </Form.Group>
            </Row>
          </Stack>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" variant={!newPlanForm.allowSubmit ? "outline-primary" : "primary"} onClick={onConfirmNewPlan} disabled={!newPlanForm.allowSubmit}>
          Create Plan
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
