import React from "react"
import { Outlet } from "react-router-dom"

import AppsProvider from "src/contexts/AppsContext/AppsProvider"

import EditAppModal from "./EditAppModal"
import EditPlanModal from "./EditPlanModal"
import EditTaskModal from "./EditTaskModal"
import NewAppModal from "./NewAppModal"
import NewPlanModal from "./NewPlanModal"
import NewTaskModal from "./NewTaskModal"
import ViewAppModal from "./ViewAppModal"
import ViewPlanModal from "./ViewPlanModal"
import ViewTaskModal from "./ViewTaskModal"

export default function AppsRoot() {
  return (
    <AppsProvider>
      <Outlet />
      <NewAppModal />
      <ViewAppModal />
      <EditAppModal />
      <NewPlanModal />
      <ViewPlanModal />
      <EditPlanModal />
      <NewTaskModal />
      <ViewTaskModal />
      <EditTaskModal />
    </AppsProvider>
  )
}
