import React from "react"
import Button from "react-bootstrap/Button"
import ButtonGroup from "react-bootstrap/ButtonGroup"
import Col from "react-bootstrap/Col"
import Dropdown from "react-bootstrap/Dropdown"
import DropdownButton from "react-bootstrap/DropdownButton"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"
import Row from "react-bootstrap/Row"
import Stack from "react-bootstrap/Stack"

import { capitalize } from "@han-keong/tms-helpers/stringHelper"

import PlanSelector from "src/components/PlanSelector"
import ValidationError from "src/components/ValidationError"
import useAppsContext from "src/contexts/AppsContext/useAppsContext"
import { downloadCsvFile, downloadTextFile, generateCsv } from "src/helpers/fileHelper"
import useNewTask from "src/hooks/formHooks/useNewTask"

import TaskNoteCard from "./TaskNoteCard"

export default function EditTaskModal() {
  const { state, modalOpen, selectedTask, plans, notes, editTaskForm, newNoteForm, canEditSelectedTask, canEditSelectedTaskPlan, canPromoteSelectedTask, onCancelEditTask, onDemoteTask, onPromoteTask, onConfirmEditTask, onConfirmNewNote } = useAppsContext()

  const selectPlanForm = useNewTask()

  const downloadNotesTxt = () => {
    downloadTextFile(selectedTask.notes, `${selectedTask.taskId}_notes`)
  }

  const downloadNotesCsv = () => {
    const columns = ["Logon UserID", "Current State", "Date & Timestamp", "Note Type", "Note Content"]
    const accessors = ["createdBy", "taskState", "createdAt", "noteType", "content"]
    const csv = generateCsv(notes, columns, accessors)
    downloadCsvFile(csv, `${selectedTask.taskId}_notes`)
  }

  return (
    <Modal size="lg" show={modalOpen && state === "edit task" && selectedTask && canEditSelectedTask} onHide={onCancelEditTask}>
      <Modal.Header closeButton>
        <Modal.Title>
          Update <strong>{selectedTask?.taskName ?? ""}</strong> Task
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack direction="vertical" gap={2}>
            <Row>
              <Form.Group controlId="formGroupTaskAppAcronym" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Task App Acronym</Form.Label>
                <Form.Control plaintext readOnly value={selectedTask?.project ?? ""} />
              </Form.Group>
              <Form.Group controlId="formGroupTaskId" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Task Id</Form.Label>
                <Form.Control plaintext readOnly value={selectedTask?.taskId ?? ""} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupTaskCreator" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Task Creator</Form.Label>
                <Form.Control plaintext readOnly value={selectedTask?.createdBy ?? ""} />
              </Form.Group>
              <Form.Group controlId="formGroupTaskCreateDate" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Task Create Date</Form.Label>
                <Form.Control plaintext readOnly value={selectedTask?.createdAt.toDateString() ?? ""} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupTaskState" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Task State</Form.Label>
                <Form.Control plaintext readOnly value={selectedTask?.state ?? ""} />
              </Form.Group>
              <Form.Group controlId="formGroupTaskOwner" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Task Owner</Form.Label>
                <Form.Control plaintext readOnly value={selectedTask?.updatedBy ?? ""} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupTaskName" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Task Name</Form.Label>
                <Form.Control plaintext readOnly value={selectedTask?.taskName ?? ""} />
              </Form.Group>
              <Form.Group controlId="formGroupTaskPlan" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Task Plan</Form.Label>
                {canEditSelectedTaskPlan ? (
                  <>
                    <ValidationError offset="20px" visible={selectPlanForm.hasError("plan") || editTaskForm.hasError("plan")}>
                      {!editTaskForm.hasError("plan") ? selectPlanForm.getError("plan") : editTaskForm.getError("plan")}
                    </ValidationError>
                    <PlanSelector placeholder="Select plan" onInput={selectPlanForm.plan.onChange} plans={plans} value={editTaskForm.plan.value ?? ""} onChange={editTaskForm.plan.onChange} />
                  </>
                ) : selectedTask && selectedTask.plan ? (
                  <Form.Control plaintext readOnly value={selectedTask.plan} />
                ) : (
                  <Form.Control plaintext readOnly className="text-muted" value="null" />
                )}
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupTaskDescription" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Task Description</Form.Label>
                {selectedTask && selectedTask.description && <Form.Control plaintext readOnly as="textarea" rows={Math.min(Math.floor((selectedTask?.description ?? "").length / 90), 9)} value={selectedTask.description} />}
                {!(selectedTask && selectedTask.description) && <Form.Control plaintext readOnly as="textarea" rows={2} className="text-muted" value="null" />}
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupTaskNotes" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Task Notes</Form.Label>
                <ValidationError offset="20px" visible={newNoteForm.hasError("content")}>
                  {newNoteForm.getError("content")}
                </ValidationError>
                <Form.Control placeholder="Enter note" autoComplete="off" as="textarea" rows={2} className="mb-2" value={newNoteForm.content.value ?? ""} onChange={newNoteForm.content.onChange} />
                {notes && notes.length > 0 ? (
                  <Stack direction="vertical" gap={2} className="overflow-auto" style={{ maxHeight: "max(35vh, 200px)" }}>
                    {notes.map((note, index) => (
                      <TaskNoteCard note={note} key={index} />
                    ))}
                  </Stack>
                ) : (
                  <Form.Control plaintext readOnly as="textarea" rows={2} value="No notes found." className="text-muted" />
                )}
              </Form.Group>
            </Row>
          </Stack>
        </Form>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <ButtonGroup>
          <Button variant={!newNoteForm.allowSubmit ? "outline-dark" : "dark"} onClick={onConfirmNewNote} disabled={!newNoteForm.allowSubmit}>
            Add Note
          </Button>
          {/* <DropdownButton id="export-notes-dropdown" title="Export Notes" variant="secondary" as={ButtonGroup}>
            <Dropdown.Item onClick={downloadNotesTxt}>As .txt File</Dropdown.Item>
            <Dropdown.Item onClick={downloadNotesCsv}>As .csv File</Dropdown.Item>
          </DropdownButton> */}
        </ButtonGroup>
        <ButtonGroup>
          {selectedTask && selectedTask.canDemote() && (
            <Button variant={!editTaskForm.allowSubmit || (newNoteForm.isDirty && !newNoteForm.allowSubmit) ? "outline-danger" : "danger"} onClick={onDemoteTask} disabled={!editTaskForm.allowSubmit || (newNoteForm.isDirty && !newNoteForm.allowSubmit)}>
              {capitalize(selectedTask.demoteAlias)} Task
            </Button>
          )}
          {selectedTask && selectedTask.state === "open" && (
            <Button variant={!(editTaskForm.isDirty || newNoteForm.isDirty) || (editTaskForm.isDirty && !editTaskForm.allowSubmit) || (newNoteForm.isDirty && !newNoteForm.allowSubmit) ? "outline-primary" : "primary"} onClick={onConfirmEditTask} disabled={!(editTaskForm.isDirty || newNoteForm.isDirty) || (editTaskForm.isDirty && !editTaskForm.allowSubmit) || (newNoteForm.isDirty && !newNoteForm.allowSubmit)}>
              Update Task
            </Button>
          )}
          {selectedTask && selectedTask.canPromote() && (
            <Button variant={!canPromoteSelectedTask || !editTaskForm.allowSubmit || (newNoteForm.isDirty && !newNoteForm.allowSubmit) ? "outline-success" : "success"} onClick={onPromoteTask} disabled={!canPromoteSelectedTask || !editTaskForm.allowSubmit || (newNoteForm.isDirty && !newNoteForm.allowSubmit)}>
              {capitalize(selectedTask.promoteAlias)} Task
            </Button>
          )}
        </ButtonGroup>
      </Modal.Footer>
    </Modal>
  )
}
