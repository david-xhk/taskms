import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import AppsContext from "src/contexts/AppsContext"
import useAuth from "src/contexts/AuthContext/useAuth"
import useEventEmitter from "src/contexts/EventEmitterContext/useEventEmitter"
import useFlashMessage from "src/contexts/FlashMessageContext/useFlashMessage"
import useDemoteTask from "src/hooks/apiHooks/useDemoteTask"
import usePromoteTask from "src/hooks/apiHooks/usePromoteTask"
import useApp from "src/hooks/dataHooks/useApp"
import useApps from "src/hooks/dataHooks/useApps"
import useGroups from "src/hooks/dataHooks/useGroups"
import useNotes from "src/hooks/dataHooks/useNotes"
import usePlans from "src/hooks/dataHooks/usePlans"
import useTasks from "src/hooks/dataHooks/useTasks"
import useEditApp from "src/hooks/formHooks/useEditApp"
import useEditPlan from "src/hooks/formHooks/useEditPlan"
import useEditTask from "src/hooks/formHooks/useEditTask"
import useNewApp from "src/hooks/formHooks/useNewApp"
import useNewGroup from "src/hooks/formHooks/useNewGroup"
import useNewNote from "src/hooks/formHooks/useNewNote"
import useNewPlan from "src/hooks/formHooks/useNewPlan"
import useNewTask from "src/hooks/formHooks/useNewTask"
import useEffectOnSync from "src/hooks/useEffectOnSync"

export default function AppsProvider(props) {
  const { children } = props

  const { appName = "" } = useParams()
  const demoteTask = useDemoteTask()
  const promoteTask = usePromoteTask()
  const flashMessage = useFlashMessage()
  const { emit } = useEventEmitter({ name: "apps" })

  // State
  const [state, setState] = useState(/** @type {"new app" | "view app" | "edit app" | "new plan" | "view plan" | "edit plan" | "new task" | "view task" | "edit task" | null} */ (null))
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedApp, setSelectedApp] = useState(/** @type {import("@han-keong/tms-types/Project").default?} */ (null))
  const [selectedPlan, setSelectedPlan] = useState(/** @type {import("@han-keong/tms-types/ProjectPlan").default?} */ (null))
  const [selectedTask, setSelectedTask] = useState(/** @type {import("@han-keong/tms-types/ProjectTask").default?} */ (null))
  const [selectedPermit, setSelectedPermit] = useState("")

  // Data
  const app = useApp({ appName })
  const apps = useApps()
  const plans = usePlans({ appName })
  const tasks = useTasks({ appName })
  const notes = useNotes({ taskId: selectedTask?.taskId })
  const groups = useGroups()
  const isLoading = appName ? apps.isFetching : app.isFetching || plans.isFetching || tasks.isFetching
  const notFound = appName ? app.notFound : false

  // Forms
  const newAppForm = useNewApp()
  const editAppForm = useEditApp({ app: selectedApp })
  const newPlanForm = useNewPlan({ appName })
  const editPlanForm = useEditPlan({ plan: selectedPlan })
  const newTaskForm = useNewTask({ appName })
  const editTaskForm = useEditTask({ task: selectedTask, allowClean: true })
  const newNoteForm = useNewNote({ taskId: selectedTask?.taskId })
  const newGroupForm = useNewGroup()

  // Auth
  const auth = useAuth()
  const isInPermitCreate = (selectedApp && auth.currentUser && selectedApp.isInPermitCreate(auth.currentUser.groups)) || false
  const isInPermitOpen = (selectedApp && auth.currentUser && selectedApp.isInPermitOpen(auth.currentUser.groups)) || false
  const isInPermitTodo = (selectedApp && auth.currentUser && selectedApp.isInPermitTodo(auth.currentUser.groups)) || false
  const isInPermitDoing = (selectedApp && auth.currentUser && selectedApp.isInPermitDoing(auth.currentUser.groups)) || false
  const isInPermitDone = (selectedApp && auth.currentUser && selectedApp.isInPermitDone(auth.currentUser.groups)) || false
  const canEditTask = task => (selectedApp && auth.currentUser && task && task.state !== "closed" && selectedApp.isInPermitGroup(task.state, auth.currentUser.groups)) || false
  const canEditSelectedTask = (selectedTask && canEditTask(selectedTask)) || false
  const canEditSelectedTaskPlan = (selectedTask && canEditSelectedTask && (selectedTask.state === "open" || selectedTask.state === "done")) || false
  const canPromoteSelectedTask = (selectedTask && canEditSelectedTask && !(selectedTask.state === "done" && "plan" in editTaskForm.data)) || false

  // Effects
  useEffectOnSync(async () => {
    if (!auth.isLoggedIn || !auth.currentUser?.username || modalOpen) {
      return
    }
    if (auth.isProjectLead) {
      groups.fetch()
    }
    if (!appName) {
      apps.fetch()
    } else {
      if (!(await app.fetch())) {
        return
      }
      plans.fetch()
      tasks.fetch()
      if (selectedTask) {
        notes.fetch()
      }
    }
  }, [auth.isLoggedIn, auth.currentUser?.username, appName])

  useEffect(() => {
    if (app.data) {
      setSelectedApp(app.data)
    }
  }, [app.data])

  useEffect(() => {
    editAppForm.reset()
    newGroupForm.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedApp])

  useEffect(() => {
    editPlanForm.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlan])

  useEffect(() => {
    editTaskForm.reset()
    newNoteForm.reset()
    if (selectedTask) {
      notes.fetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTask])

  // Helper functions
  const fetchData = async () => {
    if (auth.isProjectLead) {
      groups.fetch()
    }
    if (selectedTask) {
      notes.fetch()
    }
    if (!appName) {
      if (!(await apps.fetch())) {
        return
      }
    } else {
      if (!(await app.fetch())) {
        return
      }
      if (!(await plans.fetch())) {
        return
      }
      if (!(await tasks.fetch())) {
        return
      }
    }
    return true
  }

  const changeState = newState => {
    if (!["new app", "view app", "edit app", "new plan", "view plan", "edit plan", "new task", "view task", "edit task", null].includes(newState) || newState === state) {
      return
    }
    if (state === "new app") {
      onCancelNewApp()
    } else if (state === "view app") {
      onCancelViewApp()
    } else if (state === "edit app") {
      onCancelEditApp()
    } else if (state === "new plan") {
      onCancelNewPlan()
    } else if (state === "view plan") {
      onCancelViewPlan()
    } else if (state === "edit plan") {
      onCancelEditPlan()
    } else if (state === "new task") {
      onCancelNewTask()
    } else if (state === "view task") {
      onCancelViewTask()
    } else if (state === "edit task") {
      onCancelEditTask()
    }
    setState(newState)
  }

  const openModal = () => {
    if (!modalOpen) {
      emit("modal open")
      setTimeout(() => setModalOpen(true))
    }
  }

  const closeModal = callback => {
    if (modalOpen) {
      emit("modal close")
      setModalOpen(false)
      if (typeof callback === "function") {
        setTimeout(() => callback())
      }
    } else if (typeof callback === "function") {
      callback()
    }
  }

  // App callbacks
  const onNewApp = async args => {
    if (!(await auth.checkProjectLead())) {
      return
    }
    emit("new app", args)
    changeState("new app")
    if (!args?.noModal) {
      openModal()
    }
    return true
  }

  const onCancelNewApp = () => {
    closeModal(() => {
      if (state === "new app") {
        setState(null)
      }
      newAppForm.reset()
    })
  }

  const onConfirmNewApp = async () => {
    if (!(await auth.checkProjectLead())) {
      return
    }
    if (!(await newAppForm.submit())) {
      return
    }
    onCancelNewApp()
    apps.fetch()
    flashMessage("New application created!", "success")
    return true
  }

  const onViewApp = async args => {
    if (!(await auth.checkUser())) {
      return
    }
    if (args?.app) {
      setSelectedApp(args.app)
    } else if (!selectedApp) {
      return
    }
    emit("view app", args)
    changeState("view app")
    if (!args?.noModal) {
      openModal()
    }
    return true
  }

  const onCancelViewApp = () => {
    closeModal(() => {
      if (state === "view app") {
        setState(null)
      }
    })
  }

  const onEditApp = async args => {
    if (!(await auth.checkProjectLead())) {
      return
    }
    if (args?.app) {
      setSelectedApp(args.app)
    } else if (!selectedApp) {
      return
    }
    setSelectedPermit("")
    emit("edit app", args)
    changeState("edit app")
    if (!args?.noModal) {
      openModal()
    }
    return true
  }

  const onCancelEditApp = () => {
    closeModal(() => {
      if (state === "edit app") {
        setState(null)
      }
      editAppForm.reset()
      newGroupForm.reset()
    })
  }

  const onConfirmEditApp = async () => {
    if (!selectedApp) {
      return
    }
    if (!(await auth.checkProjectLead())) {
      return
    }
    if (!(await editAppForm.submit())) {
      return
    }
    onCancelEditApp()
    apps.fetch()
    if (appName) {
      app.fetch()
    }
    flashMessage("Application updated!", "success")
    return true
  }

  const onSelectPermit = permit => {
    setSelectedPermit(permit)
    newGroupForm.reset()
  }

  const onNewGroup = async () => {
    if (!(await auth.checkAdmin())) {
      return
    }
    if (!(await newGroupForm.submit())) {
      return
    }
    groups.fetch()
    flashMessage("New group created!", "success")
    return true
  }

  // Plan callbacks
  const onNewPlan = async args => {
    if (!selectedApp) {
      return
    }
    if (!(await auth.checkProjectManager())) {
      return
    }
    emit("new plan", args)
    changeState("new plan")
    if (!args?.noModal) {
      openModal()
    }
    return true
  }

  const onCancelNewPlan = () => {
    closeModal(() => {
      if (state === "new plan") {
        setState(null)
      }
      newPlanForm.reset()
    })
  }

  const onConfirmNewPlan = async () => {
    if (!selectedApp) {
      return
    }
    if (!(await auth.checkProjectManager())) {
      return
    }
    if (!(await newPlanForm.submit())) {
      return
    }
    onCancelNewPlan()
    plans.fetch()
    flashMessage("New application plan created!", "success")
    return true
  }

  const onViewPlan = async args => {
    if (!(await auth.checkUser())) {
      return
    }
    if (args?.plan) {
      setSelectedPlan(args.plan)
    } else if (!selectedPlan) {
      return
    }
    emit("view plan", args)
    changeState("view plan")
    if (!args?.noModal) {
      openModal()
    }
    return true
  }

  const onCancelViewPlan = () => {
    closeModal(() => {
      if (state === "view plan") {
        setState(null)
      }
    })
  }

  const onEditPlan = async args => {
    if (!auth.checkProjectManager()) {
      return
    }
    if (args?.plan) {
      setSelectedPlan(args.plan)
    } else if (!selectedPlan) {
      return
    }
    emit("edit plan", args)
    changeState("edit plan")
    if (!args?.noModal) {
      openModal()
    }
    return true
  }

  const onCancelEditPlan = () => {
    closeModal(() => {
      if (state === "edit plan") {
        setState(null)
      }
      editPlanForm.reset()
    })
  }

  const onConfirmEditPlan = async () => {
    if (!selectedApp || !selectedPlan) {
      return
    }
    if (!(await auth.checkProjectManager())) {
      return
    }
    if (!(await editPlanForm.submit())) {
      return
    }
    onCancelEditPlan()
    plans.fetch()
    flashMessage("Application plan updated!", "success")
    return true
  }

  // Task callbacks
  const onNewTask = async args => {
    if (!selectedApp) {
      return
    }
    if (!(await auth.checkGroups(selectedApp.permit.create))) {
      return
    }
    emit("new task", args)
    changeState("new task")
    if (!args?.noModal) {
      openModal()
    }
    return true
  }

  const onCancelNewTask = () => {
    closeModal(() => {
      if (state === "new task") {
        setState(null)
      }
      newTaskForm.reset()
    })
  }

  const onConfirmNewTask = async () => {
    if (!selectedApp) {
      return
    }
    if (!(await auth.checkGroups(selectedApp.permit.create))) {
      return
    }
    if (!(await newTaskForm.submit())) {
      return
    }
    onCancelNewTask()
    tasks.fetch()
    flashMessage("New application task created!", "success")
    return true
  }

  const onViewTask = async args => {
    if (!(await auth.checkUser())) {
      return
    }
    if (args?.task) {
      setSelectedTask(args.task)
    } else if (!selectedTask) {
      return
    }
    emit("view task", args)
    changeState("view task")
    if (!args?.noModal) {
      openModal()
    }
    return true
  }

  const onCancelViewTask = () => {
    closeModal(() => {
      if (state === "view task") {
        setState(null)
      }
    })
  }

  const onEditTask = async args => {
    if (!selectedApp) {
      return
    }
    if (args?.task) {
      setSelectedTask(args.task)
    } else if (!selectedTask) {
      return
    }
    if (!(await auth.checkGroups(selectedApp.permit[(args?.task ?? selectedTask).state]))) {
      return
    }
    emit("edit task", args)
    changeState("edit task")
    if (!args?.noModal) {
      openModal()
    }
    return true
  }

  const onCancelEditTask = () => {
    closeModal(() => {
      if (state === "edit task") {
        setState(null)
      }
      editTaskForm.reset()
    })
  }

  const onConfirmEditTask = async () => {
    if (!selectedApp || !selectedTask || selectedTask.state === null || selectedTask.state === "closed") {
      return
    }
    if (!(await auth.checkGroups(selectedApp.permit[selectedTask.state]))) {
      return
    }
    if (newNoteForm.isDirty) {
      newNoteForm.submit()
    }
    if (!(await editTaskForm.submit())) {
      return
    }
    onCancelEditTask()
    if (newNoteForm.isDirty) {
      onCancelNewNote()
    }
    tasks.fetch()
    flashMessage("Application task updated!", "success")
    return true
  }

  const onDemoteTask = () => {
    if (!selectedApp || !selectedTask || !selectedTask.previousState || !selectedTask.canDemote()) {
      return
    }
    editTaskForm.state.onChange(selectedTask.previousState)
    return onConfirmEditTask()
  }

  const onPromoteTask = () => {
    if (!selectedApp || !selectedTask || !selectedTask.nextState || !selectedTask.canPromote()) {
      return
    }
    editTaskForm.state.onChange(selectedTask.nextState)
    return onConfirmEditTask()
  }

  const onDemoteAnyTask = async task => {
    if (!selectedApp || !task || !task.previousState || !task.canDemote()) {
      return
    }
    if (!(await auth.checkGroups(selectedApp.permit[task.state]))) {
      return
    }
    if (!(await demoteTask(task))) {
      return
    }
    tasks.fetch()
    flashMessage("Application task demoted!", "success")
    return true
  }

  const onPromoteAnyTask = async task => {
    if (!selectedApp || !task || !task.nextState || !task.canPromote()) {
      return
    }
    if (!(await auth.checkGroups(selectedApp.permit[task.state]))) {
      return
    }
    if (!(await promoteTask(task))) {
      return
    }
    tasks.fetch()
    flashMessage("Application task promoted!", "success")
    return true
  }

  const onNewNote = async () => {
    if (!selectedApp || !selectedTask || selectedTask.state === null || selectedTask.state === "closed") {
      return
    }
    if (!(await auth.checkGroups(selectedApp.permit[selectedTask.state]))) {
      return
    }
    return true
  }

  const onCancelNewNote = () => {
    newNoteForm.reset()
  }

  const onConfirmNewNote = async () => {
    if (!selectedApp || !selectedTask || selectedTask.state === null || selectedTask.state === "closed") {
      return
    }
    if (!(await auth.checkGroups(selectedApp.permit[selectedTask.state]))) {
      return
    }
    if (!(await newNoteForm.submit())) {
      return
    }
    onCancelNewNote()
    notes.fetch()
    flashMessage("New note created!", "success")
    return true
  }

  // Other callbacks
  const onReload = async () => {
    if (!(await auth.checkUser())) {
      return
    }
    if (!(await fetchData())) {
      return
    }
    return true
  }

  const appContext = {
    // State
    appName,
    state,
    modalOpen,
    selectedApp,
    selectedPlan,
    selectedTask,
    selectedPermit,
    isLoading,
    notFound,

    // Data
    apps: apps.data,
    plans: plans.data,
    tasks: tasks.data,
    notes: notes.data,
    groups: groups.data,

    // Forms
    newAppForm,
    editAppForm,
    newPlanForm,
    editPlanForm,
    newTaskForm,
    editTaskForm,
    newNoteForm,
    newGroupForm,

    // Auth
    isInPermitCreate,
    isInPermitOpen,
    isInPermitTodo,
    isInPermitDoing,
    isInPermitDone,
    canEditTask,
    canEditSelectedTask,
    canEditSelectedTaskPlan,
    canPromoteSelectedTask,

    // App callbacks
    onNewApp,
    onCancelNewApp,
    onConfirmNewApp,
    onViewApp,
    onCancelViewApp,
    onEditApp,
    onCancelEditApp,
    onConfirmEditApp,
    onSelectPermit,
    onNewGroup,

    // Plan callbacks
    onNewPlan,
    onCancelNewPlan,
    onConfirmNewPlan,
    onViewPlan,
    onCancelViewPlan,
    onEditPlan,
    onCancelEditPlan,
    onConfirmEditPlan,

    // Task callbacks
    onNewTask,
    onCancelNewTask,
    onConfirmNewTask,
    onViewTask,
    onCancelViewTask,
    onEditTask,
    onCancelEditTask,
    onConfirmEditTask,
    onDemoteTask,
    onPromoteTask,
    onDemoteAnyTask,
    onPromoteAnyTask,
    onNewNote,
    onCancelNewNote,
    onConfirmNewNote,

    // Other callbacks
    onReload
  }

  return <AppsContext.Provider value={appContext}>{children}</AppsContext.Provider>
}
