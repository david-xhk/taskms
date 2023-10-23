import React, { useState } from "react"
import Button from "react-bootstrap/Button"
import ButtonGroup from "react-bootstrap/ButtonGroup"
import Card from "react-bootstrap/Card"

import { isDark } from "@han-keong/tms-helpers/colorHelper"
import { capitalize } from "@han-keong/tms-helpers/stringHelper"

import Truncate from "src/components/Truncate"
import useAppsContext from "src/contexts/AppsContext/useAppsContext"

export default function TaskCard(props) {
  const { task } = props

  const { plans, canEditTask, onViewPlan, onViewTask, onEditTask, onDemoteAnyTask, onPromoteAnyTask } = useAppsContext()

  const [isUpdating, setIsUpdating] = useState(false)

  const plan = task && plans ? plans.find(plan => plan.planName === task.plan) : null
  const canEdit = canEditTask(task)

  const onDemoteTask = async () => {
    if (isUpdating) {
      return
    }
    setIsUpdating(true)
    await onDemoteAnyTask(task)
    setIsUpdating(false)
  }

  const onPromoteTask = async () => {
    if (isUpdating) {
      return
    }
    setIsUpdating(true)
    await onPromoteAnyTask(task)
    setIsUpdating(false)
  }

  return (
    <Card>
      {plan && (
        <Card.Header className="h6 position-relative fw-light text-truncate py-1 px-2" style={{ backgroundColor: plan.colour, color: isDark(plan.colour) ? "#ffffff" : "#000000", cursor: "pointer", fontSize: "0.75rem" }} onClick={() => onViewPlan({ plan })}>
          <Truncate text={task.plan} />
        </Card.Header>
      )}
      <Card.Body className="p-2" style={{ cursor: "pointer" }} onClick={canEdit ? () => onEditTask({ task }) : () => onViewTask({ task })}>
        <Card.Title className="fw-semibold text-truncate" style={{ fontSize: "0.75rem", marginBottom: "0.125rem" }}>
          <Truncate text={task.taskName} length={120} />
        </Card.Title>
        <Card.Text className="fw-lighter text-truncate text-muted" style={{ fontSize: "0.5rem" }}>
          <Truncate text={task.description} length={120} />
        </Card.Text>
      </Card.Body>
      {canEdit && (
        <Card.Footer className="d-flex flex-grow-0 py-1 px-2">
          <ButtonGroup size="sm">
            {/* {task.canDemote() && (
              <Button variant="light" data-tooltip-content={capitalize(task.demoteAlias) + " Task"} data-tooltip-id="my-tooltip" onClick={onDemoteTask} disabled={isUpdating} style={{ fontSize: "0.625rem", padding: "0.1rem 0.3rem" }}>
                <i className="fas fa-chevron-left"></i>
              </Button>
            )} */}
            {task.state !== "closed" && (
              <Button variant="light" data-tooltip-content="Update Task" data-tooltip-id="my-tooltip" onClick={() => onEditTask({ task })} disabled={isUpdating} style={{ fontSize: "0.625rem", padding: "0.1rem 0.3rem" }}>
                <i className="fas fa-pen"></i>
              </Button>
            )}
            {/* {task.canPromote() && (
              <Button variant="light" data-tooltip-content={capitalize(task.promoteAlias) + " Task"} data-tooltip-id="my-tooltip" onClick={onPromoteTask} disabled={isUpdating} style={{ fontSize: "0.625rem", padding: "0.1rem 0.3rem" }}>
                <i className="fas fa-chevron-right"></i>
              </Button>
            )} */}
          </ButtonGroup>
        </Card.Footer>
      )}
    </Card>
  )
}
