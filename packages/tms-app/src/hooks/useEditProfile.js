import { useCallback, useEffect } from "react"
import { useImmerReducer } from "use-immer"

import { hasNoDifference } from "@han-keong/tms-helpers/arrayHelper"
import { validateGroup, validateGroups } from "@han-keong/tms-validators/groupValidator"
import { validateEmail, validateEmailDelayed, validateEmailImmediately, validatePassword, validatePasswordDelayed, validatePasswordImmediately } from "@han-keong/tms-validators/userValidator"
import * as validators from "@han-keong/tms-validators/validators"

import api from "../api.js"
import config from "../config.js"
import useAuth from "./useAuth.js"
import useEffectOnWindowFocus from "./useEffectOnWindowFocus.js"
import useEventEmitter from "./useEventEmitter.js"
import useFlashMessage from "./useFlashMessage.js"

const initialState = {
  email: "",
  password: "",
  active: false,
  groups: [],
  original: {},
  dirty: {},
  changes: {},
  result: {},
  isValidating: false,
  isFetching: false,
  isSaving: false,
  notFound: false,
  notAuthorized: false,
  hideStatus: false,
  fetchOrdinal: 0,
  saveOrdinal: 0
}

export default function useEditProfile(username) {
  const auth = useAuth()
  const { emit, on, cancelAll, onCancel } = useEventEmitter("useEditProfile")
  const flashMessage = useFlashMessage()

  function reducer(draft, action) {
    switch (action.type) {
      case "emailImmediately":
        validators.deleteError(draft.result, "email")
        draft.email = action.value
        delete draft.changes.email
        if (draft.email && draft.email !== draft.original.email) {
          draft.dirty.email = true
          draft.isValidating = validateEmailImmediately(draft.email, draft.result)
        } else {
          delete draft.dirty.email
          draft.isValidating = false
          if (!draft.email && draft.original.email) {
            draft.changes.email = null
          }
        }
        break

      case "emailAfterDelay":
        draft.isValidating = false
        if (validateEmailDelayed(draft.email, draft.result)) {
          draft.changes.email = draft.email
          delete draft.dirty.email
        }
        break

      case "passwordImmediately":
        validators.deleteError(draft.result, "password")
        draft.password = action.value
        delete draft.changes.password
        if (draft.password) {
          draft.dirty.password = true
          draft.isValidating = validatePasswordImmediately(draft.password, draft.result)
        } else {
          delete draft.dirty.password
          draft.isValidating = false
        }
        break

      case "passwordAfterDelay":
        draft.isValidating = false
        if (validatePasswordDelayed(draft.password, draft.result)) {
          draft.changes.password = draft.password
          delete draft.dirty.password
        }
        break

      case "activeChanged":
        draft.active = action.value
        delete draft.changes.active
        if (draft.active !== draft.original.active) {
          draft.changes.active = draft.active
        }
        break

      case "groupChanged":
        validators.deleteError(draft.result, "groups")
        if (action.value) {
          validateGroup(action.value, draft.result, "groups", { prefix: "group" })
        }
        break

      case "groupsChanged":
        validators.deleteError(draft.result, "groups")
        draft.groups = [...action.value]
        delete draft.changes.groups
        if (!hasNoDifference(draft.groups, draft.original.groups) && (draft.groups.length === 0 || validateGroups(draft.groups, draft.result))) {
          draft.changes.groups = [...draft.groups]
        }
        break

      case "fetchData":
        draft.fetchOrdinal++
        break

      case "fetchStarted":
        draft.isFetching = true
        draft.notFound = false
        draft.notAuthorized = false
        if (action.hideStatus) {
          draft.hideStatus = true
        }
        break

      case "fetchSuccess":
        if ((draft.original.email === undefined && !draft.email) || (draft.original.email && draft.email === draft.original.email)) {
          draft.email = action.data.email ?? ""
        }
        if ((draft.original.active === undefined && !draft.active) || (draft.original.active && draft.active === draft.original.active)) {
          draft.active = action.data.active
        } else if (draft.active !== action.data.active) {
          draft.changes.active = draft.active
        }
        if ((draft.original.groups === undefined && draft.groups.length === 0) || (draft.original.groups && hasNoDifference(draft.groups, draft.original.groups))) {
          draft.groups = [...action.data.groups]
        } else if (!hasNoDifference(draft.groups, action.data.groups)) {
          draft.changes.groups = [...draft.groups]
        }
        draft.original.email = action.data.email ?? ""
        draft.original.active = action.data.active
        draft.original.groups = [...action.data.groups]
      // fallthrough

      case "fetchFinished":
        draft.isFetching = false
        break

      case "saveData":
        if (draft.changes.email) {
          validateEmail(draft.changes.email, draft.result)
        }
        if (draft.changes.password) {
          validatePassword(draft.changes.password, draft.result)
        }
        if (draft.changes.groups) {
          validateGroups(draft.changes.groups, draft.result)
        }
        if (!validators.hasErrors(draft.result)) {
          draft.saveOrdinal++
        }
        break

      case "saveStarted":
        draft.isSaving = true
        if (action.hideStatus) {
          draft.hideStatus = true
        }
        break

      case "saveFinished":
        draft.isSaving = false
        break

      case "notFound":
        draft.notFound = true
        break

      case "notAuthorized":
        draft.notAuthorized = true
        break

      case "formErrors":
        validators.setErrors(draft.result, action.errors)
        break

      case "showStatus":
        draft.hideStatus = false
        break

      case "resetForm":
        draft.email = draft.original.email ?? ""
        draft.password = ""
        draft.active = draft.original.active ?? false
        draft.groups = draft.original.groups ?? []
        draft.dirty = {}
        draft.changes = {}
        validators.deleteErrors(draft.result)
        draft.isValidating = false
        draft.isFetching = false
        draft.isSaving = false
        draft.notFound = false
        draft.notAuthorized = false
        draft.hideStatus = false
        draft.fetchOrdinal = 0
        draft.saveOrdinal = 0
    }

    const args = []
    const { type, ...values } = action
    if (Object.keys(values).length > 0) {
      args.push(values)
    }
    const state = {}
    const dirty = Object.keys(draft.dirty)
    if (dirty.length > 0) {
      state.dirty = dirty.join(", ")
    }
    const changes = Object.keys(draft.changes)
    if (changes.length > 0) {
      state.changes = changes.join(", ")
    }
    if (validators.hasErrors(draft.result)) {
      state.errors = Object.keys(validators.getErrors(draft.result)).join(", ")
    }
    if (Object.keys(state).length > 0) {
      args.push(state)
    }
    emit(type, ...args)
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState)
  const { email, password, active, groups, original, dirty, changes, isValidating, isFetching, isSaving, notFound, notAuthorized, hideStatus, fetchOrdinal, saveOrdinal } = state

  const hasErrors = validators.hasErrors(state.result)
  const errors = validators.getErrors(state.result)
  const hasEmailError = validators.hasError(state.result, "email")
  const emailError = validators.getError(state.result, "email")
  const hasPasswordError = validators.hasError(state.result, "password")
  const passwordError = validators.getError(state.result, "password")
  const hasGroupsError = validators.hasError(state.result, "groups")
  const groupsError = validators.getError(state.result, "groups")

  const isDirty = Object.keys(dirty).length > 0
  const hasChanges = Object.keys(changes).length > 0
  const allowSubmit = !isFetching && !isSaving && !hasErrors && !isDirty && hasChanges
  const showStatus = (isSaving || isValidating || isFetching) && !hideStatus
  const status = isSaving ? "Saving Changes" : isValidating ? "Validating Changes" : "Fetching Data"

  useEffect(
    function setTimeoutForEmailAfterDelay() {
      if (email && dirty.email && !hasEmailError && !isSaving) {
        // emit("setTimeoutForEmailAfterDelay")
        const timeout = setTimeout(() => dispatch({ type: "emailAfterDelay" }), config.VALIDATION_DELAY_MS)
        return () => clearTimeout(timeout)
      }
    },
    [email, dirty.email, hasEmailError, isSaving]
  )

  useEffect(
    function setTimeoutForPasswordAfterDelay() {
      if (password && dirty.password && !hasPasswordError && !isSaving) {
        // emit("setTimeoutForPasswordAfterDelay")
        const timeout = setTimeout(() => dispatch({ type: "passwordAfterDelay" }), config.VALIDATION_DELAY_MS)
        return () => clearTimeout(timeout)
      }
    },
    [password, dirty.password, hasPasswordError, isSaving]
  )

  useEffect(
    function setTimeoutForShowStatus() {
      if (hideStatus) {
        // emit("setTimeoutForShowStatus")
        const timeout = setTimeout(() => dispatch({ type: "showStatus" }), config.VALIDATION_DELAY_MS)
        return () => clearTimeout(timeout)
      }
    },
    [hideStatus]
  )

  useEffectOnWindowFocus(function fetchDataOnCheckAuthSuccess() {
    auth.on("checkAuthEffect success", () => {
      // emit("fetchDataOnCheckAuthSuccess")
      dispatch({ type: "fetchData", hideStatus: true })
    })
  }, [])

  useEffect(
    function fetchDataOnUsernameChanged() {
      if (!username) {
        return
      }
      // emit("fetchDataOnUsernameChanged")
      dispatch({ type: "fetchData" })
      on("fetchSuccess", () => dispatch({ type: "resetForm" }))
    },
    [username]
  )

  useEffect(
    function fetchData() {
      if (!fetchOrdinal) {
        return
      }
      dispatch({ type: "fetchStarted" })
      function onFetch(res) {
        if (res.data?.success) {
          dispatch({ type: "fetchSuccess", data: res.data.data })
        } else {
          if (res.status === 403) {
            dispatch({ type: "notAuthorized" })
          } else if (res.status === 404) {
            dispatch({ type: "notFound" })
          }
          flashMessage(res.data?.message ?? "Unknown error occured. Please try again later.", "danger")
        }
        dispatch({ type: "fetchFinished" })
      }
      if (username === auth.currentUser?.username) {
        return onCancel(api.getCurrentUser(onFetch))
      } else {
        return onCancel(api.getUser({ params: username }, onFetch))
      }
    },
    [fetchOrdinal]
  )

  useEffect(
    function saveData() {
      if (!saveOrdinal) {
        return
      }
      dispatch({ type: "saveStarted" })
      async function onSave(res) {
        try {
          await auth.checkAuth()
        } catch {
          dispatch({ type: "resetForm" })
          return
        }
        if (res.data?.success) {
          emit("saveSuccess")
          dispatch({ type: "fetchData" })
        } else if (res.data?.errors) {
          dispatch({ type: "formErrors", errors: res.data.errors })
        } else {
          flashMessage(res.data?.message ?? "Unknown error occured. Please try again later.", "danger")
        }
        dispatch({ type: "saveFinished" })
      }
      if (username === auth.currentUser?.username) {
        return onCancel(api.patchCurrentUser({ data: changes }, onSave))
      } else {
        return onCancel(api.patchUser({ data: changes, params: username }, onSave))
      }
    },
    [saveOrdinal]
  )

  const dispatchFieldChanged = type =>
    function onFieldChanged(value) {
      value = value?.target?.value ?? value
      if (value !== undefined) {
        dispatch({ type, value })
      }
    }

  const onEmailChanged = useCallback(dispatchFieldChanged("emailImmediately"), [])

  const onPasswordChanged = useCallback(dispatchFieldChanged("passwordImmediately"), [])

  const onActiveChanged = useCallback(dispatchFieldChanged("activeChanged"), [])

  const onGroupsChanged = useCallback(dispatchFieldChanged("groupsChanged"), [])

  const onGroupChanged = useCallback(dispatchFieldChanged("groupChanged"), [])

  const onErrors = useCallback(function onErrors(errors) {
    if (errors !== undefined) {
      dispatch({ type: "formErrors", errors })
    }
  }, [])

  const handleSubmit = useCallback(
    function handleSubmit(e) {
      e.preventDefault()
      if (!hasErrors) {
        dispatch({ type: "saveData", hideStatus: true })
        on("saveSuccess", () => {
          flashMessage("📝 Profile updated!", "success")
          dispatch({ type: "resetForm" })
        })
      }
    },
    [hasErrors]
  )

  const refresh = useCallback((showMessage = false) => {
    dispatch({ type: "fetchData" })
    if (showMessage) {
      on("fetchSuccess", () => {
        flashMessage("🔄 Profile has been refreshed.", "info")
      })
    }
  }, [])

  const reset = useCallback((showMessage = false) => {
    dispatch({ type: "resetForm" })
    cancelAll()
    if (showMessage) {
      on("resetForm", () => {
        flashMessage("↩️ Form has been reset.", "info")
      })
    }
  }, [])

  return {
    email,
    password,
    active,
    groups,
    original,
    dirty,
    changes,
    isValidating,
    isFetching,
    isSaving,
    notFound,
    notAuthorized,
    hasErrors,
    errors,
    hasEmailError,
    emailError,
    hasPasswordError,
    passwordError,
    hasGroupsError,
    groupsError,
    isDirty,
    hasChanges,
    allowSubmit,
    showStatus,
    status,
    cancelAll,
    onEmailChanged,
    onPasswordChanged,
    onActiveChanged,
    onGroupsChanged,
    onGroupChanged,
    onErrors,
    handleSubmit,
    refresh,
    reset
  }
}
