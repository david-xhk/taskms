import React from "react"
import Form from "react-bootstrap/Form"
import { useMediaQuery } from "react-responsive"

import Table from "src/components/Table"
import Truncate from "src/components/Truncate"
import useAppsContext from "src/contexts/AppsContext/useAppsContext"

export default function ViewPlanTableRow(props) {
  const { plan } = props

  const { onViewPlan, onEditPlan } = useAppsContext()

  const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" })

  const childProps = {}
  if (!isSmallScreen) {
    childProps.style = { cursor: "pointer" }
    childProps.onClick = () => onEditPlan({ plan, noModal: true })
  }

  return (
    <Table.Row>
      <Table.Header {...childProps}>
        <Form.Control plaintext readOnly value={plan.planName} className="fw-bold me-4 cursor-unset" />
      </Table.Header>
      <Table.Header {...childProps}>
        <Truncate text={plan.project} length={15} />
      </Table.Header>
      <Table.Cell {...childProps}>
        <Form.Control plaintext readOnly type="color" value={plan.colour} className="border rounded-3 pe-none" />
      </Table.Cell>
      <Table.Cell {...childProps}>
        {plan.startDate && <Form.Control plaintext readOnly value={plan.startDate.toDateString()} className="me-4 cursor-unset" />}
        {!plan.startDate && <Form.Control plaintext readOnly placeholder="null" value="" className="text-muted me-4 cursor-unset" />}
      </Table.Cell>
      <Table.Cell {...childProps}>
        {plan.endDate && <Form.Control plaintext readOnly value={plan.endDate.toDateString()} className="me-4 cursor-unset" />}
        {!plan.endDate && <Form.Control plaintext readOnly placeholder="null" value="" className="text-muted me-4 cursor-unset" />}
      </Table.Cell>
      <Table.Cell {...childProps}>
        <Table.ActionButtonGroup>
          {isSmallScreen && <Table.ActionButton icon="fas fa-eye" tooltip="View Plan" onClick={() => onViewPlan({ plan })} />}
          <Table.ActionButton icon="fas fa-pen" tooltip="Update Plan" onClick={() => onEditPlan({ plan, noModal: !isSmallScreen })} />
        </Table.ActionButtonGroup>
      </Table.Cell>
    </Table.Row>
  )
}
