import React, { useRef } from "react"
import Form from "react-bootstrap/Form"
import ToggleButton from "react-toggle"

import GroupSelector from "src/components/GroupSelector"
import Table from "src/components/Table"
import ValidationError from "src/components/ValidationError"
import useEffectOnClickOutside from "src/hooks/useEffectOnClickOutside"

export default function NewUserTableRow(props) {
  const { newUserForm, onCancel, onConfirm, groups, newGroupForm, onNewGroup } = props

  const rowRef = useRef(/** @type {Table.Row?} */ (null))

  useEffectOnClickOutside(rowRef, onCancel)

  const onKeyDown = /** @type {React.KeyboardEventHandler<HTMLTableRowElement>} */ event => {
    if (event.key === "Escape") {
      onCancel()
    } else if (event.key === "Enter") {
      if (newUserForm.allowSubmit) {
        onConfirm()
      }
    }
  }

  return (
    <Table.Row onKeyDown={onKeyDown} ref={rowRef}>
      <Table.Cell>
        <ValidationError visible={newUserForm.hasError("username")}>{newUserForm.getError("username")}</ValidationError>
        <Form.Control placeholder="Alphabets or digits only" type="search" autoComplete="off" autoFocus value={newUserForm.username.value} onChange={newUserForm.username.onChange} />
      </Table.Cell>
      <Table.Cell>
        <ValidationError visible={newUserForm.hasError("password")}>{newUserForm.getError("password")}</ValidationError>
        <Form.Control placeholder="Alphabets, digits, and special only" type="password" autoComplete="off" value={newUserForm.password.value} onChange={newUserForm.password.onChange} />
      </Table.Cell>
      <Table.Cell>
        <ValidationError visible={newUserForm.hasError("email")}>{newUserForm.getError("email")}</ValidationError>
        <Form.Control placeholder="Valid email address" type="search" autoComplete="off" value={newUserForm.email.value ?? ""} onChange={newUserForm.email.onChange} />
      </Table.Cell>
      <Table.Cell>
        <ToggleButton icons={{ checked: "🟢", unchecked: "⛔️" }} checked={newUserForm.active.value} onChange={newUserForm.active.onChange} />
      </Table.Cell>
      <Table.Cell>
        <ValidationError visible={newGroupForm.hasError("group")}>{newGroupForm.getError("group")}</ValidationError>
        <GroupSelector placeholder="Select groups" allowNew allowCreate={newGroupForm.allowSubmit} onCreate={onNewGroup} onInput={newGroupForm.group.onChange} groups={groups} value={newUserForm.groups.value} onChange={newUserForm.groups.onChange} />
      </Table.Cell>
      <Table.Cell>
        <Table.ActionButtonGroup>
          <Table.ActionButton icon="fas fa-check" tooltip="Create User" variant={!newUserForm.allowSubmit ? "outline-success" : "success"} onClick={onConfirm} disabled={!newUserForm.allowSubmit} />
          <Table.ActionButton icon="fas fa-times" tooltip="Cancel" variant="danger" onClick={onCancel} />
        </Table.ActionButtonGroup>
      </Table.Cell>
    </Table.Row>
  )
}
