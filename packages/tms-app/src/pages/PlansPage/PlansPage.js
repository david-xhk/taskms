import React from "react"
import { useMediaQuery } from "react-responsive"
import { useNavigate } from "react-router-dom"

import Header from "src/components/Header"
import Table from "src/components/Table"
import useAppsContext from "src/contexts/AppsContext/useAppsContext"
import useFlashMessage from "src/contexts/FlashMessageContext/useFlashMessage"
import ProtectedPage from "src/pages/ProtectedPage"

import EditPlanTableRow from "./EditPlanTableRow"
import EmptyPlanTableRow from "./EmptyPlanTableRow"
import NewPlanTableRow from "./NewPlanTableRow"
import ViewPlanTableRow from "./ViewPlanTableRow"

export default function PlansPage() {
  const navigate = useNavigate()
  const flashMessage = useFlashMessage()
  const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" })
  const { appName, state, selectedPlan, isLoading, notFound, plans, onViewApp, onNewPlan, onReload } = useAppsContext()

  const onRefresh = async () => {
    if (await onReload()) {
      flashMessage("Plans have been refreshed.", "info")
    }
  }

  return (
    <ProtectedPage title={`${appName ? appName + " " : ""}Plans`} isLoading={isLoading} notFound={notFound} authorization="pm">
      <Header>
        <Header.Title>
          <span className="fw-bold cursor-pointer" onClick={onViewApp}>
            {appName ?? ""}
          </span>{" "}
          Plans
        </Header.Title>
        <Header.ButtonGroup>
          <Header.Button name="Create New Plan" icon="fas fa-plus" onClick={() => onNewPlan({ noModal: !isSmallScreen })} disabled={state === "new plan"} />
          <Header.Button name="View App" icon="fas fa-project-diagram" onClick={() => onViewApp()} />
          <Header.Button name="Refresh Plans" icon="fas fa-sync-alt" onClick={onRefresh} />
          <Header.Button name="Manage Tasks" icon="fas fa-columns" onClick={() => navigate(`/apps/${appName ?? ""}`)} />
        </Header.ButtonGroup>
      </Header>
      <Table columns="MVP Name,App Acronym,Colour,Start Date,End Date,Actions">
        {!isSmallScreen && state === "new plan" && <NewPlanTableRow />}
        {plans && plans.length > 0 && (
          <>
            {plans.map((plan, index) => {
              if (!isSmallScreen && state === "edit plan" && selectedPlan && selectedPlan.planName === plan.planName) {
                return <EditPlanTableRow plan={plan} key={index} />
              } else {
                return <ViewPlanTableRow plan={plan} key={index} />
              }
            })}
          </>
        )}
        {!((!isSmallScreen && state === "new plan") || (plans && plans.length > 0)) && <EmptyPlanTableRow />}
      </Table>
    </ProtectedPage>
  )
}
