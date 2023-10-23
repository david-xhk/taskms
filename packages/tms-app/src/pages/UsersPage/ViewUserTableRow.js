import React from "react"
import Form from "react-bootstrap/Form"
import ToggleButton from "react-toggle"

import GroupSelector from "src/components/GroupSelector"
import Table from "src/components/Table"

export default function ViewUserTableRow(props) {
  const { user, onView, onEdit, onToggleActiveUser } = props

  const childProps = { style: { cursor: "pointer" }, onClick: onEdit }

  return (
    <Table.Row>
      <Table.Header {...childProps}>
        <Form.Control plaintext readOnly value={user.username} className="fw-bold me-4 cursor-unset" />
      </Table.Header>
      <Table.Cell {...childProps}>
        <Form.Control plaintext readOnly value="..." className="me-4 cursor-unset" />
      </Table.Cell>
      <Table.Cell {...childProps}>
        {user.email && <Form.Control plaintext readOnly value={user.email} className="me-4 cursor-unset" />}
        {!user.email && <Form.Control plaintext readOnly value="null" className="text-muted me-4 cursor-unset" />}
      </Table.Cell>
      <Table.Cell {...childProps}>
        <ToggleButton icons={{ checked: "🟢", unchecked: "⛔️" }} checked={user.active} disabled />
      </Table.Cell>
      <Table.Cell {...childProps}>
        <GroupSelector plaintext readOnly value={user.groups} />
      </Table.Cell>
      <Table.Cell>
        <Table.ActionButtonGroup>
          <Table.ActionButton icon="fas fa-eye" tooltip="View User" onClick={onView} />
          <Table.ActionButton icon="fas fa-pen" tooltip="Update User" onClick={onEdit} />
          {user.active && <Table.ActionButton icon="fas fa-minus-circle" tooltip="Deactivate User" onClick={onToggleActiveUser} />}
          {!user.active && <Table.ActionButton icon="fas fa-circle" tooltip="Activate User" onClick={onToggleActiveUser} />}
        </Table.ActionButtonGroup>
      </Table.Cell>
    </Table.Row>
  )
}
