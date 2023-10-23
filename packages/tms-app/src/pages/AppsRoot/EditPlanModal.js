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

export default function EditPlanModal() {
  const { state, modalOpen, selectedPlan, editPlanForm, onCancelEditPlan, onConfirmEditPlan } = useAppsContext()

  const auth = useAuth()

  return (
    <Modal size="lg" show={modalOpen && state === "edit plan" && selectedPlan && auth.isProjectManager} onHide={onCancelEditPlan}>
      <Modal.Header closeButton>
        <Modal.Title>
          Update <strong>{selectedPlan?.planName ?? ""}</strong> Plan
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
                <ValidationError offset="20px" visible={editPlanForm.hasError("colour")}>
                  {editPlanForm.getError("colour")}
                </ValidationError>
                <Form.Control type="color" value={editPlanForm.colour.value} onInput={editPlanForm.colour.onChange} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupPlanStartDate" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Plan Start Date</Form.Label>
                <ValidationError offset="20px" visible={editPlanForm.hasError("startDate")}>
                  {editPlanForm.getError("startDate")}
                </ValidationError>
                <Form.Control onFocus={onDateInputFocus} autoComplete="off" placeholder="Select date" value={editPlanForm.startDate.value ?? ""} onChange={editPlanForm.startDate.onChange} max={editPlanForm.endDate.value ? toYYYYMMDDDate(editPlanForm.endDate.value) : undefined} />
              </Form.Group>
              <Form.Group controlId="formGroupPlanEndDate" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Plan End Date</Form.Label>
                <ValidationError offset="20px" visible={editPlanForm.hasError("endDate")}>
                  {editPlanForm.getError("endDate")}
                </ValidationError>
                <Form.Control onFocus={onDateInputFocus} autoComplete="off" placeholder="Select date" value={editPlanForm.endDate.value ?? ""} onChange={editPlanForm.endDate.onChange} min={editPlanForm.startDate.value ? toYYYYMMDDDate(editPlanForm.startDate.value) : undefined} />
              </Form.Group>
            </Row>
          </Stack>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant={!editPlanForm.allowSubmit ? "outline-primary" : "primary"} onClick={onConfirmEditPlan} disabled={!editPlanForm.allowSubmit}>
          Update Plan
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
