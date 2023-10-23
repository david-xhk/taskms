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

export default function NewAppModal() {
  const { state, modalOpen, selectedPermit, groups, newAppForm, newGroupForm, onCancelNewApp, onConfirmNewApp, onSelectPermit, onNewGroup } = useAppsContext()

  const auth = useAuth()

  return (
    <Modal size="lg" show={modalOpen && state === "new app" && auth.isProjectLead} onHide={onCancelNewApp}>
      <Modal.Header closeButton>
        <Modal.Title>
          New <strong>Application</strong>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack direction="vertical" gap={2}>
            <Row>
              <Form.Group controlId="formGroupAppAcronym" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">App Acronym (Required)</Form.Label>
                <ValidationError offset="20px" visible={newAppForm.hasError("project")}>
                  {newAppForm.getError("project")}
                </ValidationError>
                <Form.Control placeholder="Alphabets, digits, or dashes only" type="search" autoComplete="off" autoFocus value={newAppForm.project.value} onChange={newAppForm.project.onChange} />
              </Form.Group>
              <Form.Group controlId="formGroupAppStartRNum" className="position-relative" as={Col} xs={6}>
                <Form.Label className="text-muted small mb-0">App Rnumber (Required)</Form.Label>
                <ValidationError offset="20px" visible={newAppForm.hasError("runningNum")}>
                  {newAppForm.getError("runningNum")}
                </ValidationError>
                <Form.Control placeholder="Non-negative integer" autoComplete="off" value={newAppForm.runningNum.value} onInput={newAppForm.runningNum.onChange} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupAppPermitCreate" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">App Permit Create (Required)</Form.Label>
                <ValidationError offset="20px" visible={(selectedPermit === "create" && newGroupForm.hasError("group")) || newAppForm.hasError("permitCreate")}>
                  {selectedPermit === "create" && !newAppForm.hasError("permitCreate") ? newGroupForm.getError("group") : newAppForm.getError("permitCreate")}
                </ValidationError>
                <GroupSelector placeholder="Select groups" allowNew={auth.isAdmin} allowCreate={newGroupForm.allowSubmit} onCreate={onNewGroup} onInput={newGroupForm.group.onChange} groups={groups} value={newAppForm.permitCreate.value} onChange={newAppForm.permitCreate.onChange} onFocus={() => onSelectPermit("create")} />
              </Form.Group>
              <Form.Group controlId="formGroupAppPermitOpen" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">App Permit Open (Required)</Form.Label>
                <ValidationError offset="20px" visible={(selectedPermit === "open" && newGroupForm.hasError("group")) || newAppForm.hasError("permitOpen")}>
                  {selectedPermit === "open" && !newAppForm.hasError("permitOpen") ? newGroupForm.getError("group") : newAppForm.getError("permitOpen")}
                </ValidationError>
                <GroupSelector placeholder="Select groups" allowNew={auth.isAdmin} allowCreate={newGroupForm.allowSubmit} onCreate={onNewGroup} onInput={newGroupForm.group.onChange} groups={groups} value={newAppForm.permitOpen.value} onChange={newAppForm.permitOpen.onChange} onFocus={() => onSelectPermit("open")} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupAppPermitTodo" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">App Permit Todo (Required)</Form.Label>
                <ValidationError offset="20px" visible={(selectedPermit === "todo" && newGroupForm.hasError("group")) || newAppForm.hasError("permitTodo")}>
                  {selectedPermit === "todo" && !newAppForm.hasError("permitTodo") ? newGroupForm.getError("group") : newAppForm.getError("permitTodo")}
                </ValidationError>
                <GroupSelector placeholder="Select groups" allowNew={auth.isAdmin} allowCreate={newGroupForm.allowSubmit} onCreate={onNewGroup} onInput={newGroupForm.group.onChange} groups={groups} value={newAppForm.permitTodo.value} onChange={newAppForm.permitTodo.onChange} onFocus={() => onSelectPermit("todo")} />
              </Form.Group>
              <Form.Group controlId="formGroupAppPermitDoing" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">App Permit Doing (Required)</Form.Label>
                <ValidationError offset="20px" visible={(selectedPermit === "doing" && newGroupForm.hasError("group")) || newAppForm.hasError("permitDoing")}>
                  {selectedPermit === "doing" && !newAppForm.hasError("permitDoing") ? newGroupForm.getError("group") : newAppForm.getError("permitDoing")}
                </ValidationError>
                <GroupSelector placeholder="Select groups" allowNew={auth.isAdmin} allowCreate={newGroupForm.allowSubmit} onCreate={onNewGroup} onInput={newGroupForm.group.onChange} groups={groups} value={newAppForm.permitDoing.value} onChange={newAppForm.permitDoing.onChange} onFocus={() => onSelectPermit("doing")} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupAppPermitDone" className="position-relative" as={Col} xs={6}>
                <Form.Label className="text-muted small mb-0">App Permit Done (Required)</Form.Label>
                <ValidationError offset="20px" visible={(selectedPermit === "done" && newGroupForm.hasError("group")) || newAppForm.hasError("permitDone")}>
                  {selectedPermit === "done" && !newAppForm.hasError("permitDone") ? newGroupForm.getError("group") : newAppForm.getError("permitDone")}
                </ValidationError>
                <GroupSelector placeholder="Select groups" allowNew={auth.isAdmin} allowCreate={newGroupForm.allowSubmit} onCreate={onNewGroup} onInput={newGroupForm.group.onChange} groups={groups} value={newAppForm.permitDone.value} onChange={newAppForm.permitDone.onChange} onFocus={() => onSelectPermit("done")} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupAppStartDate" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">App Start Date</Form.Label>
                <ValidationError offset="20px" visible={newAppForm.hasError("startDate")}>
                  {newAppForm.getError("startDate")}
                </ValidationError>
                <Form.Control onFocus={onDateInputFocus} autoComplete="off" placeholder="Select date" value={newAppForm.startDate.value ?? ""} onChange={newAppForm.startDate.onChange} max={newAppForm.endDate.value ? toYYYYMMDDDate(newAppForm.endDate.value) : undefined} />
              </Form.Group>
              <Form.Group controlId="formGroupAppEndDate" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">App End Date</Form.Label>
                <ValidationError offset="20px" visible={newAppForm.hasError("endDate")}>
                  {newAppForm.getError("endDate")}
                </ValidationError>
                <Form.Control onFocus={onDateInputFocus} autoComplete="off" placeholder="Select date" value={newAppForm.endDate.value ?? ""} onChange={newAppForm.endDate.onChange} min={newAppForm.startDate.value ? toYYYYMMDDDate(newAppForm.startDate.value) : undefined} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="formGroupAppDescription" className="position-relative" as={Col}>
                <Form.Label className="text-muted small mb-0">App Description</Form.Label>
                <ValidationError offset="20px" visible={newAppForm.hasError("description")}>
                  {newAppForm.getError("description")}
                </ValidationError>
                <Form.Control placeholder="Enter description" autoComplete="off" as="textarea" rows={2} value={newAppForm.description.value ?? ""} onChange={newAppForm.description.onChange} />
              </Form.Group>
            </Row>
          </Stack>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" variant={!newAppForm.allowSubmit ? "outline-primary" : "primary"} onClick={onConfirmNewApp} disabled={!newAppForm.allowSubmit}>
          Create Application
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
