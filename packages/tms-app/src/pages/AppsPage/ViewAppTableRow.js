import React from "react"
import { useNavigate } from "react-router-dom"

import Table from "src/components/Table"
import Truncate from "src/components/Truncate"
import useAppsContext from "src/contexts/AppsContext/useAppsContext"
import useAuth from "src/contexts/AuthContext/useAuth"

export default function ViewAppTableRow(props) {
  const { app } = props

  const auth = useAuth()
  const navigate = useNavigate()

  const { onEditApp } = useAppsContext()

  const childProps = { style: { cursor: "pointer" }, onClick: () => navigate(`/apps/${app.projectName}`) }

  return (
    <Table.Row>
      <Table.Header {...childProps}>
        <Truncate text={app.projectName} length={10} />
      </Table.Header>
      <Table.Cell {...childProps}>
        {app.description && <Truncate text={app.description} length={15} />}
        {!app.description && <span className="text-muted">null</span>}
      </Table.Cell>
      <Table.Cell {...childProps}>
        {app.startDate && app.startDate.toLocaleDateString()}
        {!app.startDate && <span className="text-muted">null</span>}
      </Table.Cell>
      <Table.Cell {...childProps}>
        {app.endDate && app.endDate.toLocaleDateString()}
        {!app.endDate && <span className="text-muted">null</span>}
      </Table.Cell>
      <Table.Cell {...childProps}>{app.runningNum - app.numTasks}</Table.Cell>
      <Table.Cell {...childProps}>{app.runningNum}</Table.Cell>
      {auth.isProjectLead && (
        <Table.Cell>
          <Table.ActionButton icon="fas fa-pen" size="sm" tooltip="Update App" onClick={() => onEditApp({ app })} />
        </Table.Cell>
      )}
    </Table.Row>
  )
}
