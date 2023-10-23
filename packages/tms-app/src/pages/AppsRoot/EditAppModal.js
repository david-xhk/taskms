import React from "react"
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"
import Row from "react-bootstrap/Row"
import Stack from "react-bootstrap/Stack"

import { toYYYYMMDDDate } from "@han-keong/tms-helpers/dateHelper"

import GroupSelector from "src/components/GroupSelector"
import ValidationError from "src/components/ValidationError"
import useAppsContext from "src/contexts/AppsContext/useAppsContext"
import useAuth from "src/contexts/AuthContext/useAuth"
import { onDateInputFocus } from "src/helpers/formHelper"

export default function EditAppModal() {
  const { state, modalOpen, selectedApp, selectedPermit, groups, editAppForm, newGroupForm, onCancelEditApp, onConfirmEditApp, onSelectPermit, onNewGroup } = useAppsContext()

  const auth = useAuth()

  return (
    <Modal size="lg" show={modalOpen && state === "edit app" && selectedApp && auth.isProjectLead} onHide={onCancelEditApp}>
      <Modal.Header closeButton>
        <Modal.Title>
          Update <strong>{selectedApp?.projectName ?? ""}</strong> Application
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
                <ValidationError offset="20px" visible={(selectedPermit === "create" && newGroupForm.hasError("group")) || editAppForm.hasError("permitCreate")}>
                  {selectedPermit === "create" && !editAppForm.hasError("permitCreate") ? newGroupForm.getError("group") : editAppForm.getError("permitCreate")}
                </ValidationError>
                <GroupSelector placeholder="Select groups" allowNew={auth.isAdmin} allowCreate={newGroupForm.allowSubmit} onCreate={onNewGroup} onInput={newGroupForm.group.onChange} groups={groups} value={editAppForm.permitCreate.value} onChange={editAppForm.permitCreate.onChange} onFocus={() => onSelectPermit("create")} />
              </Form.Group>
              <Form.Group controlId="formGroupAppPermitOpen" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">App Permit Open</Form.Label>
                <ValidationError offset="20px" visible={(selectedPermit === "open" && newGroupForm.hasError("group")) || editAppForm.hasError("permitOpen")}>
                  {selectedPermit === "open" && !editAppForm.hasError("permitOpen") ? newGroupForm.getError("group") : editAppForm.getError("permitOpen")}
                </ValidationError>
                <GroupSelector placeholder="Select groups" allowNew={auth.isAdmin} allowCreate={newGroupForm.allowSubmit} onCreate={onNewGroup} onInput={newGroupForm.group.onChange} groups={groups} value={editAppForm.permitOpen.value} onChange={editAppForm.permitOpen.onChange} onFocus={() => onSelectPermit("open")} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupAppPermitTodo" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">App Permit Todo</Form.Label>
                <ValidationError offset="20px" visible={(selectedPermit === "todo" && newGroupForm.hasError("group")) || editAppForm.hasError("permitTodo")}>
                  {selectedPermit === "todo" && !editAppForm.hasError("permitTodo") ? newGroupForm.getError("group") : editAppForm.getError("permitTodo")}
                </ValidationError>
                <GroupSelector placeholder="Select groups" allowNew={auth.isAdmin} allowCreate={newGroupForm.allowSubmit} onCreate={onNewGroup} onInput={newGroupForm.group.onChange} groups={groups} value={editAppForm.permitTodo.value} onChange={editAppForm.permitTodo.onChange} onFocus={() => onSelectPermit("todo")} />
              </Form.Group>
              <Form.Group controlId="formGroupAppPermitDoing" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">App Permit Doing</Form.Label>
                <ValidationError offset="20px" visible={(selectedPermit === "doing" && newGroupForm.hasError("group")) || editAppForm.hasError("permitDoing")}>
                  {selectedPermit === "doing" && !editAppForm.hasError("permitDoing") ? newGroupForm.getError("group") : editAppForm.getError("permitDoing")}
                </ValidationError>
                <GroupSelector placeholder="Select groups" allowNew={auth.isAdmin} allowCreate={newGroupForm.allowSubmit} onCreate={onNewGroup} onInput={newGroupForm.group.onChange} groups={groups} value={editAppForm.permitDoing.value} onChange={editAppForm.permitDoing.onChange} onFocus={() => onSelectPermit("doing")} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupAppPermitDone" className="position-relative" as={Col} xs={6}>
                <Form.Label className="text-muted small mb-0">App Permit Done</Form.Label>
                <ValidationError offset="20px" visible={(selectedPermit === "done" && newGroupForm.hasError("group")) || editAppForm.hasError("permitDone")}>
                  {selectedPermit === "done" && !editAppForm.hasError("permitDone") ? newGroupForm.getError("group") : editAppForm.getError("permitDone")}
                </ValidationError>
                <GroupSelector placeholder="Select groups" allowNew={auth.isAdmin} allowCreate={newGroupForm.allowSubmit} onCreate={onNewGroup} onInput={newGroupForm.group.onChange} groups={groups} value={editAppForm.permitDone.value} onChange={editAppForm.permitDone.onChange} onFocus={() => onSelectPermit("done")} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupAppStartDate" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">App Start Date</Form.Label>
                <ValidationError offset="20px" visible={editAppForm.hasError("startDate")}>
                  {editAppForm.getError("startDate")}
                </ValidationError>
                <Form.Control onFocus={onDateInputFocus} autoComplete="off" placeholder="Select date" value={editAppForm.startDate.value ?? ""} onChange={editAppForm.startDate.onChange} max={editAppForm.endDate.value ? toYYYYMMDDDate(editAppForm.endDate.value) : undefined} />
              </Form.Group>
              <Form.Group controlId="formGroupAppEndDate" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">App End Date</Form.Label>
                <ValidationError offset="20px" visible={editAppForm.hasError("endDate")}>
                  {editAppForm.getError("endDate")}
                </ValidationError>
                <Form.Control onFocus={onDateInputFocus} autoComplete="off" placeholder="Select date" value={editAppForm.endDate.value ?? ""} onChange={editAppForm.endDate.onChange} min={editAppForm.startDate.value ? toYYYYMMDDDate(editAppForm.startDate.value) : undefined} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupAppDescription" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">App Description</Form.Label>
                <ValidationError offset="20px" visible={editAppForm.hasError("description")}>
                  {editAppForm.getError("description")}
                </ValidationError>
                <Form.Control placeholder="Enter description" autoComplete="off" as="textarea" rows={editAppForm.description.value ? Math.min(Math.floor(editAppForm.description.value.length / 90), 9) : 2} value={editAppForm.description.value ?? ""} onChange={editAppForm.description.onChange} />
              </Form.Group>
            </Row>
          </Stack>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant={!editAppForm.allowSubmit ? "outline-primary" : "primary"} onClick={onConfirmEditApp} disabled={!editAppForm.allowSubmit}>
          Update Application
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
