import React from "react"
import Col from "react-bootstrap/Col"
import Dropdown from "react-bootstrap/Dropdown"
import DropdownButton from "react-bootstrap/DropdownButton"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"
import Row from "react-bootstrap/Row"
import Stack from "react-bootstrap/Stack"

import useAppsContext from "src/contexts/AppsContext/useAppsContext"
import { downloadCsvFile, downloadTextFile, generateCsv } from "src/helpers/fileHelper"

import TaskNoteCard from "./TaskNoteCard"

export default function ViewTaskModal() {
  const { state, modalOpen, selectedTask, notes, onCancelViewTask } = useAppsContext()

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
    <Modal size="lg" show={modalOpen && state === "view task" && selectedTask} onHide={onCancelViewTask}>
      <Modal.Header closeButton>
        <Modal.Title>
          <strong>
            {selectedTask?.project ?? ""} {selectedTask?.taskName ?? ""}
          </strong>{" "}
          Task
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
                {selectedTask && selectedTask.plan && <Form.Control plaintext readOnly value={selectedTask.plan} />}
                {!(selectedTask && selectedTask.plan) && <Form.Control plaintext readOnly className="text-muted" value="null" />}
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupTaskDescription" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Task Description</Form.Label>
                {selectedTask && selectedTask.description && <Form.Control plaintext readOnly as="textarea" rows={Math.min(Math.floor(selectedTask.description.length / 90), 9)} value={selectedTask.description} />}
                {!(selectedTask && selectedTask.description) && <Form.Control plaintext readOnly as="textarea" rows={2} className="text-muted" value="null" />}
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupTaskNotes" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">Task Notes</Form.Label>
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
      {/* <Modal.Footer>
        <DropdownButton title="Export Notes" variant="secondary" className="me-auto">
          <Dropdown.Item onClick={downloadNotesTxt}>As .txt File</Dropdown.Item>
          <Dropdown.Item onClick={downloadNotesCsv}>As .csv File</Dropdown.Item>
        </DropdownButton>
      </Modal.Footer> */}
    </Modal>
  )
}
