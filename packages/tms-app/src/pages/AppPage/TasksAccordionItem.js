import React from "react"
import Accordion from "react-bootstrap/Accordion"
import Stack from "react-bootstrap/Stack"

import { capitalize } from "@han-keong/tms-helpers/stringHelper"

import useAppsContext from "src/contexts/AppsContext/useAppsContext"

import TaskCard from "./TaskCard"

export default function TasksAccordionItem(props) {
  const { state } = props

  const { tasks } = useAppsContext()

  const filteredTasks = tasks ? tasks.filter(task => task.state === state) : []

  return (
    <Accordion.Item eventKey={state}>
      <Accordion.Header className="sticky-top">{capitalize(state)}</Accordion.Header>
      <Accordion.Body as={Stack} direction="vertical" gap={2} className="overflow-auto p-2" style={{ minHeight: "100px" }}>
        {filteredTasks.length > 0 && filteredTasks.map((task, index) => <TaskCard task={task} key={index} />)}
        {filteredTasks.length === 0 && <span className="text-muted p-1">No tasks found.</span>}
      </Accordion.Body>
    </Accordion.Item>
  )
}
