import React from "react"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import Stack from "react-bootstrap/Stack"

import { capitalize } from "@han-keong/tms-helpers/stringHelper"

import useAppsContext from "src/contexts/AppsContext/useAppsContext"

import TaskCard from "./TaskCard"

export default function TasksColumn(props) {
  const { state } = props

  const { tasks } = useAppsContext()

  const filteredTasks = tasks ? tasks.filter(task => task.state === state) : []

  return (
    <Col className="p-1">
      <Container fluid className="d-flex flex-column bg-light-subtle border border-light-subtle rounded-3 p-0" style={{ height: "calc(100vh - 205px)" }}>
        <h6 className="sticky-top bg-info-subtle border border-info-subtle rounded-top-3 fw-bold m-0 p-1 ps-2">{capitalize(state)}</h6>
        <Stack direction="vertical" gap={2} className="overflow-auto p-2">
          {filteredTasks.length > 0 && filteredTasks.map((task, index) => <TaskCard task={task} key={index} />)}
          {filteredTasks.length === 0 && <span className="text-muted p-1">No tasks found.</span>}
        </Stack>
      </Container>
    </Col>
  )
}
