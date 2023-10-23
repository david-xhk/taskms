import React from "react"

import Header from "src/components/Header"
import Table from "src/components/Table"
import useAppsContext from "src/contexts/AppsContext/useAppsContext"
import useAuth from "src/contexts/AuthContext/useAuth"
import useFlashMessage from "src/contexts/FlashMessageContext/useFlashMessage"
import ProtectedPage from "src/pages/ProtectedPage"

import ViewAppTableRow from "./ViewAppTableRow"

export default function AppsPage() {
  const auth = useAuth()
  const flashMessage = useFlashMessage()
  const { state, isLoading, notFound, apps, onNewApp, onReload } = useAppsContext()

  const onRefresh = async () => {
    if (await onReload()) {
      flashMessage("Applications have been refreshed.", "info")
    }
  }

  return (
    <ProtectedPage title="Apps" isLoading={isLoading} notFound={notFound}>
      <Header>
        <Header.Title>
          <strong>Applications</strong>
        </Header.Title>
        <Header.ButtonGroup>
          {auth.isProjectLead && <Header.Button name="Create New Application" icon="fas fa-plus" onClick={onNewApp} disabled={state === "new app"} />}
          <Header.Button name="Refresh Apps" icon="fas fa-sync-alt" onClick={onRefresh} />
        </Header.ButtonGroup>
      </Header>
      {auth.isProjectLead ? (
        <Table columns="App Acronym,App Description,Start Date,End Date,Start RNum,Current RNum,Actions">
          {apps && apps.length > 0 ? (
            apps.map((app, index) => <ViewAppTableRow app={app} key={index} />)
          ) : (
            <Table.Row>
              <Table.Cell colSpan={7} title="Create New Application" style={{ cursor: "pointer", padding: "11px 3px" }} onClick={onNewApp}>
                <span className="text-muted">No applications found.</span>
              </Table.Cell>
            </Table.Row>
          )}
        </Table>
      ) : (
        <Table columns="App Acronym,App Description,Start Date,End Date,Start RNum,Current RNum">
          {apps && apps.length > 0 ? (
            apps.map((app, index) => <ViewAppTableRow app={app} key={index} />)
          ) : (
            <Table.Row>
              <Table.Cell colSpan={4} style={{ padding: "11px 3px" }}>
                <span className="text-muted">No applications found.</span>
              </Table.Cell>
            </Table.Row>
          )}
        </Table>
      )}
    </ProtectedPage>
  )
}
