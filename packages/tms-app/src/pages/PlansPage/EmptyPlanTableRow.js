import React from "react"
import Form from "react-bootstrap/Form"
import { useMediaQuery } from "react-responsive"

import Table from "src/components/Table"
import Truncate from "src/components/Truncate"
import useAppsContext from "src/contexts/AppsContext/useAppsContext"

export default function EmptyPlanTableRow() {
  const { onNewPlan } = useAppsContext()

  const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" })

  if (isSmallScreen) {
    return (
      <Table.Row>
        <Table.Cell colSpan={2}>
          <Form.Control plaintext readOnly value="No plans found." className="text-muted me-4 cursor-unset" />
        </Table.Cell>
      </Table.Row>
    )
  }

  const childProps = {
    title: "Create New Plan",
    style: { cursor: "pointer" },
    onClick: () => onNewPlan({ noModal: true })
  }

  return (
    <Table.Row>
      <Table.Cell {...childProps}>
        <Form.Control plaintext readOnly value="No plans found." className="text-muted me-4 cursor-unset" />
      </Table.Cell>
      <Table.Cell {...childProps}>
        <Truncate text="" length={15} />
      </Table.Cell>
      <Table.Cell {...childProps}>
        <Form.Control plaintext readOnly type="color" value="" style={{ visibility: "hidden" }} />
      </Table.Cell>
      <Table.Cell {...childProps}>
        <Form.Control plaintext readOnly value="" className="text-muted me-4 cursor-unset" />
      </Table.Cell>
      <Table.Cell {...childProps}>
        <Form.Control plaintext readOnly value="" className="text-muted me-4 cursor-unset" />
      </Table.Cell>
      <Table.Cell {...childProps}></Table.Cell>
    </Table.Row>
  )
}
