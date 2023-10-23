import React from "react"
import Accordion from "react-bootstrap/Accordion"
import Row from "react-bootstrap/Row"
import { useMediaQuery } from "react-responsive"
import { useNavigate } from "react-router-dom"

import Header from "src/components/Header"
import useAppsContext from "src/contexts/AppsContext/useAppsContext"
import useAuth from "src/contexts/AuthContext/useAuth"
import useFlashMessage from "src/contexts/FlashMessageContext/useFlashMessage"
import ProtectedPage from "src/pages/ProtectedPage"

import TasksAccordionItem from "./TasksAccordionItem"
import TasksColumn from "./TasksColumn"

const states = ["open", "todo", "doing", "done", "closed"]

export default function AppPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const flashMessage = useFlashMessage()
  const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" })
  const { appName, state, isLoading, notFound, isInPermitCreate, onViewApp, onEditApp, onNewTask, onReload } = useAppsContext()

  const onRefresh = async () => {
    if (await onReload()) {
      flashMessage("Tasks have been refreshed.", "info")
    }
  }

  const Container = ({ children }) =>
    isSmallScreen ? (
      <Accordion alwaysOpen defaultActiveKey={[...states]} className="mb-2">
        {children}
      </Accordion>
    ) : (
      <Row xs={1} md={5} style={{ margin: "0 -0.25rem 0.5rem -0.25rem" }}>
        {children}
      </Row>
    )

  const ContainerItem = isSmallScreen ? TasksAccordionItem : TasksColumn

  return (
    <ProtectedPage title={appName ?? ""} isLoading={isLoading} notFound={notFound}>
      <Header>
        <Header.Title>
          <span className="fw-bold cursor-pointer" onClick={() => onViewApp()}>
            {appName ?? ""}
          </span>{" "}
          Tasks
        </Header.Title>
        <Header.ButtonGroup>
          {isInPermitCreate && <Header.Button name="Create New Task" icon="fas fa-plus" onClick={() => onNewTask()} disabled={state === "new task"} />}
          {auth.isProjectLead ? <Header.Button name="Update App" icon="fas fa-project-diagram" onClick={() => onEditApp()} /> : <Header.Button name="View App" icon="fas fa-project-diagram" onClick={() => onViewApp()} />}
          <Header.Button name="Refresh Tasks" icon="fas fa-sync-alt" onClick={onRefresh} />
          {auth.isProjectManager && <Header.Button name="Manage Plans" icon="fas fa-calendar-alt" onClick={() => navigate(`/apps/${appName ?? ""}/plans`)} />}
        </Header.ButtonGroup>
      </Header>
      <Container>
        {states.map((state, index) => (
          <ContainerItem state={state} key={index} />
        ))}
      </Container>
    </ProtectedPage>
  )
}
