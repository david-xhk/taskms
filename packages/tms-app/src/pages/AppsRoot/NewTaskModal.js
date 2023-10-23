import React from "react"
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"
import Row from "react-bootstrap/Row"
import Stack from "react-bootstrap/Stack"

import PlanSelector from "src/components/PlanSelector"
import ValidationError from "src/components/ValidationError"
import useAppsContext from "src/contexts/AppsContext/useAppsContext"
import useNewTask from "src/hooks/formHooks/useNewTask"

export default function NewTaskModal() {
  const { state, modalOpen, selectedApp, plans, newTaskForm, isInPermitCreate, onCancelNewTask, onConfirmNewTask } = useAppsContext()

  const selectPlanForm = useNewTask()

  return (
    <Modal size="lg" show={modalOpen && state === "new task" && isInPermitCreate} onHide={onCancelNewTask}>
      <Modal.Header closeButton>
        <Modal.Title>
          New <strong>{selectedApp?.projectName ?? ""}</strong> Task
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack direction="vertical" gap={2}>
            <Row>
              <Form.Group controlId="formGroupTaskAppAcronym" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Task App Acronym</Form.Label>
                <Form.Control plaintext readOnly value={selectedApp?.projectName ?? ""} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupTaskName" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Task Name (Required)</Form.Label>
                <ValidationError offset="20px" visible={newTaskForm.hasError("task")}>
                  {newTaskForm.getError("task")}
                </ValidationError>
                <Form.Control placeholder="Alphabets, digits, special, or spaces only" type="search" autoComplete="off" autoFocus value={newTaskForm.task.value} onChange={newTaskForm.task.onChange} />
              </Form.Group>
              <Form.Group controlId="formGroupTaskPlan" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Task Plan</Form.Label>
                <ValidationError offset="20px" visible={selectPlanForm.hasError("plan") || newTaskForm.hasError("plan")}>
                  {!newTaskForm.hasError("plan") ? selectPlanForm.getError("plan") : newTaskForm.getError("plan")}
                </ValidationError>
                <PlanSelector placeholder="Select plan" onInput={selectPlanForm.plan.onChange} plans={plans ? Object.values(plans) : []} value={newTaskForm.plan.value ?? ""} onChange={newTaskForm.plan.onChange} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupTaskDescription" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Task Description (Required)</Form.Label>
                <ValidationError offset="20px" visible={newTaskForm.hasError("description")}>
                  {newTaskForm.getError("description")}
                </ValidationError>
                <Form.Control placeholder="Enter description" autoComplete="off" as="textarea" rows={2} value={newTaskForm.description.value ?? ""} onChange={newTaskForm.description.onChange} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupTaskNotes" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Task Notes</Form.Label>
                <ValidationError offset="20px" visible={newTaskForm.hasError("note")}>
                  {newTaskForm.getError("note")}
                </ValidationError>
                <Form.Control placeholder="Enter note" autoComplete="off" as="textarea" rows={2} className="mb-2" value={newTaskForm.note.value ?? ""} onChange={newTaskForm.note.onChange} />
              </Form.Group>
            </Row>
          </Stack>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" variant={!newTaskForm.allowSubmit ? "outline-primary" : "primary"} onClick={onConfirmNewTask} disabled={!newTaskForm.allowSubmit}>
          Create Task
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
