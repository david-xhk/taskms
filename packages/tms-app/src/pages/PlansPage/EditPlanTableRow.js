import React, { useRef } from "react"
import Form from "react-bootstrap/Form"

import { toYYYYMMDDDate } from "@han-keong/tms-helpers/dateHelper"

import Table from "src/components/Table"
import Truncate from "src/components/Truncate"
import ValidationError from "src/components/ValidationError"
import useAppsContext from "src/contexts/AppsContext/useAppsContext"
import { onDateInputFocus } from "src/helpers/formHelper"
import useEffectOnClickOutside from "src/hooks/useEffectOnClickOutside"

export default function EditPlanTableRow(props) {
  const { plan } = props

  const { editPlanForm, onCancelEditPlan, onConfirmEditPlan } = useAppsContext()

  const rowRef = useRef(/** @type {Table.Row?} */ (null))

  useEffectOnClickOutside(rowRef, onCancelEditPlan)

  const onKeyDown = /** @type {React.KeyboardEventHandler<HTMLTableRowElement>} */ event => {
    if (event.key === "Escape") {
      onCancelEditPlan()
    } else if (event.key === "Enter") {
      if (editPlanForm.allowSubmit) {
        onConfirmEditPlan()
      }
    }
  }

  return (
    <Table.Row onKeyDown={onKeyDown} ref={rowRef}>
      <Table.Header>
        <Form.Control plaintext readOnly value={plan.planName} className="fw-bold me-4 cursor-unset" />
      </Table.Header>
      <Table.Header>
        <Truncate text={plan.project} length={15} />
      </Table.Header>
      <Table.Cell>
        <ValidationError visible={editPlanForm.hasError("colour")}>{editPlanForm.getError("colour")}</ValidationError>
        <Form.Control type="color" autoFocus value={editPlanForm.colour.value} onInput={editPlanForm.colour.onChange} />
      </Table.Cell>
      <Table.Cell>
        <ValidationError visible={editPlanForm.hasError("startDate")}>{editPlanForm.getError("startDate")}</ValidationError>
        <Form.Control onFocus={onDateInputFocus} autoComplete="off" placeholder="Select date" value={editPlanForm.startDate.value ?? ""} onChange={editPlanForm.startDate.onChange} max={editPlanForm.endDate.value ? toYYYYMMDDDate(editPlanForm.endDate.value) : undefined} />
      </Table.Cell>
      <Table.Cell>
        <ValidationError visible={editPlanForm.hasError("endDate")}>{editPlanForm.getError("endDate")}</ValidationError>
        <Form.Control onFocus={onDateInputFocus} autoComplete="off" placeholder="Select date" value={editPlanForm.endDate.value ?? ""} onChange={editPlanForm.endDate.onChange} min={editPlanForm.startDate.value ? toYYYYMMDDDate(editPlanForm.startDate.value) : undefined} />
      </Table.Cell>
      <Table.Cell>
        <Table.ActionButtonGroup>
          <Table.ActionButton icon="fas fa-check" tooltip="Update Plan" variant={!editPlanForm.allowSubmit ? "outline-success" : "success"} onClick={onConfirmEditPlan} disabled={!editPlanForm.allowSubmit} />
          <Table.ActionButton icon="fas fa-times" tooltip="Cancel" variant="danger" onClick={onCancelEditPlan} />
        </Table.ActionButtonGroup>
      </Table.Cell>
    </Table.Row>
  )
}
