import React, { useRef } from "react"
import Form from "react-bootstrap/Form"
import ToggleButton from "react-toggle"

import GroupSelector from "src/components/GroupSelector"
import Table from "src/components/Table"
import ValidationError from "src/components/ValidationError"
import useEffectOnClickOutside from "src/hooks/useEffectOnClickOutside"

export default function EditUserTableRow(props) {
  const { user, editUserForm, onCancel, onConfirm, groups, newGroupForm, onNewGroup } = props

  const rowRef = useRef(/** @type {Table.Row?} */ (null))

  useEffectOnClickOutside(rowRef, onCancel)

  const onKeyDown = /** @type {React.KeyboardEventHandler<HTMLTableRowElement>} */ event => {
    if (event.key === "Escape") {
      onCancel()
    } else if (event.key === "Enter") {
      if (editUserForm.allowSubmit) {
        onConfirm()
      }
    }
  }

  return (
    <Table.Row onKeyDown={onKeyDown} ref={rowRef}>
      <Table.Header>
        <Form.Control plaintext readOnly value={user.username} className="fw-bold me-4 cursor-unset" />
      </Table.Header>
      <Table.Cell>
        <ValidationError visible={editUserForm.hasError("password")}>{editUserForm.getError("password")}</ValidationError>
        <Form.Control placeholder="Alphabets, digits, and special only" type="password" autoComplete="off" autoFocus value={editUserForm.password.value} onChange={editUserForm.password.onChange} />
      </Table.Cell>
      <Table.Cell>
        <ValidationError visible={editUserForm.hasError("email")}>{editUserForm.getError("email")}</ValidationError>
        <Form.Control placeholder="Valid email address" type="search" autoComplete="off" value={editUserForm.email.value ?? ""} onChange={editUserForm.email.onChange} />
      </Table.Cell>
      <Table.Cell>
        <ToggleButton icons={{ checked: "🟢", unchecked: "⛔️" }} checked={editUserForm.active.value} onChange={editUserForm.active.onChange} />
      </Table.Cell>
      <Table.Cell>
        <ValidationError visible={newGroupForm.hasError("group")}>{newGroupForm.getError("group")}</ValidationError>
        <GroupSelector placeholder="Select groups" allowNew allowCreate={newGroupForm.allowSubmit} onCreate={onNewGroup} onInput={newGroupForm.group.onChange} groups={groups} value={editUserForm.groups.value} onChange={editUserForm.groups.onChange} />
      </Table.Cell>
      <Table.Cell>
        <Table.ActionButtonGroup>
          <Table.ActionButton icon="fas fa-check" tooltip="Update User" variant={!editUserForm.allowSubmit ? "outline-success" : "success"} onClick={onConfirm} disabled={!editUserForm.allowSubmit} />
          <Table.ActionButton icon="fas fa-times" tooltip="Cancel" variant="danger" onClick={onCancel} />
        </Table.ActionButtonGroup>
      </Table.Cell>
    </Table.Row>
  )
}
