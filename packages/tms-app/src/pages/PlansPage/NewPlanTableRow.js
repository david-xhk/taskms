import React, { useRef } from "react"
import Form from "react-bootstrap/Form"

import { toYYYYMMDDDate } from "@han-keong/tms-helpers/dateHelper"

import Table from "src/components/Table"
import Truncate from "src/components/Truncate"
import ValidationError from "src/components/ValidationError"
import useAppsContext from "src/contexts/AppsContext/useAppsContext"
import { onDateInputFocus } from "src/helpers/formHelper"
import useEffectOnClickOutside from "src/hooks/useEffectOnClickOutside"

export default function NewPlanTableRow() {
  const { selectedApp, newPlanForm, onCancelNewPlan, onConfirmNewPlan } = useAppsContext()

  const rowRef = useRef(/** @type {Table.Row?} */ (null))

  useEffectOnClickOutside(rowRef, onCancelNewPlan)

  const onKeyDown = /** @type {React.KeyboardEventHandler<HTMLTableRowElement>} */ event => {
    if (event.key === "Escape") {
      onCancelNewPlan()
    } else if (event.key === "Enter") {
      if (newPlanForm.allowSubmit) {
        onConfirmNewPlan()
      }
    }
  }

  return (
    <Table.Row onKeyDown={onKeyDown} ref={rowRef}>
      <Table.Cell>
        <ValidationError visible={newPlanForm.hasError("plan")}>{newPlanForm.getError("plan")}</ValidationError>
        <Form.Control placeholder="Alphabets, digits, or dashes only" type="search" autoComplete="off" autoFocus value={newPlanForm.plan.value ?? ""} onChange={newPlanForm.plan.onChange} />
      </Table.Cell>
      <Table.Header>
        <Truncate text={selectedApp?.projectName ?? ""} length={15} />
      </Table.Header>
      <Table.Cell>
        <ValidationError visible={newPlanForm.hasError("colour")}>{newPlanForm.getError("colour")}</ValidationError>
        <Form.Control type="color" value={newPlanForm.colour.value} onInput={newPlanForm.colour.onChange} />
      </Table.Cell>
      <Table.Cell>
        <ValidationError visible={newPlanForm.hasError("startDate")}>{newPlanForm.getError("startDate")}</ValidationError>
        <Form.Control onFocus={onDateInputFocus} autoComplete="off" placeholder="Select date" value={newPlanForm.startDate.value ?? ""} onChange={newPlanForm.startDate.onChange} max={newPlanForm.endDate.value ? toYYYYMMDDDate(newPlanForm.endDate.value) : undefined} />
      </Table.Cell>
      <Table.Cell>
        <ValidationError visible={newPlanForm.hasError("endDate")}>{newPlanForm.getError("endDate")}</ValidationError>
        <Form.Control onFocus={onDateInputFocus} autoComplete="off" placeholder="Select date" value={newPlanForm.endDate.value ?? ""} onChange={newPlanForm.endDate.onChange} min={newPlanForm.startDate.value ? toYYYYMMDDDate(newPlanForm.startDate.value) : undefined} />
      </Table.Cell>
      <Table.Cell>
        <Table.ActionButtonGroup>
          <Table.ActionButton icon="fas fa-check" tooltip="Create Plan" variant={!newPlanForm.allowSubmit ? "outline-success" : "success"} onClick={onConfirmNewPlan} disabled={!newPlanForm.allowSubmit} />
          <Table.ActionButton icon="fas fa-times" tooltip="Cancel" variant="danger" onClick={onCancelNewPlan} />
        </Table.ActionButtonGroup>
      </Table.Cell>
    </Table.Row>
  )
}
