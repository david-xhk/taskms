import { useCallback, useEffect } from "react"
import { useImmerReducer } from "use-immer"

import { hasNoDifference } from "@han-keong/helpers"
import { validateEmail, validateEmailDelayed, validateEmailImmediately, validateGroup, validateGroups, validatePassword, validatePasswordDelayed, validatePasswordImmediately } from "@han-keong/tms-validators"
import * as validators from "@han-keong/validators"

import API from "../api"
import useAuth from "./useAuth"
import useEffectOnWindowFocus from "./useEffectOnWindowFocus"
import useEventEmitter from "./useEventEmitter"
import useFlashMessage from "./useFlashMessage"

const initialState = {
  email: "",
  password: "",
  active: false,
  groups: [],
  original: {},
  dirty: {},
  changes: {},
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
        validators.deleteError(draft, "email")
        draft.email = action.value
        delete draft.changes.email
        if (draft.email && draft.email !== draft.original.email) {
          draft.dirty.email = true
          draft.isValidating = validateEmailImmediately(draft.email, draft)
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
        if (validateEmailDelayed(draft.email, draft)) {
          draft.changes.email = draft.email
          delete draft.dirty.email
        }
        break

      case "passwordImmediately":
        validators.deleteError(draft, "password")
        draft.password = action.value
        delete draft.changes.password
        if (draft.password) {
          draft.dirty.password = true
          draft.isValidating = validatePasswordImmediately(draft.password, draft)
        } else {
          delete draft.dirty.password
          draft.isValidating = false
        }
        break

      case "passwordAfterDelay":
        draft.isValidating = false
        if (validatePasswordDelayed(draft.password, draft)) {
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
        validators.deleteError(draft, "groups")
        if (action.value) {
          validateGroup(action.value, draft, "groups", { prefix: "group" })
        }
        break

      case "groupsChanged":
        validators.deleteError(draft, "groups")
        draft.groups = [...action.value]
        delete draft.changes.groups
        if (!hasNoDifference(draft.groups, draft.original.groups) && (draft.groups.length === 0 || validateGroups(draft.groups, draft))) {
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

      case "fetchFinished":
        draft.isFetching = false
        break

      case "saveData":
        if (draft.changes.email) {
          validateEmail(draft.changes.email, draft)
        }
        if (draft.changes.password) {
          validatePassword(draft.changes.password, draft)
        }
        if (draft.changes.groups) {
          validateGroups(draft.changes.groups, draft)
        }
        if (!validators.hasError(draft)) {
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

      case "fetchSuccess":
      case "saveSuccess":
        // emit("updateData", { email: action.data.email, active: action.data.active, groups: action.data.groups?.join(", ") })
        // emit("updateData before", { email: draft.email, active: draft.active, groups: draft.groups.join(", "), ...(Object.keys(draft.dirty).length > 0 && { dirty: Object.keys(draft.dirty).join(", ") }), ...(Object.keys(draft.changes).length > 0 && { changes: Object.keys(draft.changes).join(", ") }) })
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
        // emit("updateData after", { email: draft.email, active: draft.active, groups: draft.groups.join(", "), ...(Object.keys(draft.dirty).length > 0 && { dirty: Object.keys(draft.dirty).join(", ") }), ...(Object.keys(draft.changes).length > 0 && { changes: Object.keys(draft.changes).join(", ") }) })
        break

      case "notFound":
        draft.notFound = true
        break

      case "notAuthorized":
        draft.notAuthorized = true
        break

      case "formErrors":
        validators.setErrors(draft, action.errors)
        break

      case "showStatus":
        draft.hideStatus = false
        break

      case "resetForm":
        validators.deleteErrors(draft)
        draft.email = draft.original.email ?? ""
        draft.password = ""
        draft.active = draft.original.active ?? false
        draft.groups = draft.original.groups ?? []
        draft.dirty = {}
        draft.changes = {}
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
    if (validators.hasError(draft)) {
      state.errors = Object.keys(validators.getErrors(draft)).join(", ")
    }
    if (Object.keys(state).length > 0) {
      args.push(state)
    }
    emit(type, ...args)
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState)
  const { email, password, active, groups, original, dirty, changes, isValidating, isFetching, isSaving, notFound, notAuthorized, hideStatus, fetchOrdinal, saveOrdinal } = state

  const hasErrors = validators.hasErrors(state)
  const errors = validators.getErrors(state)
  const hasEmailError = validators.hasError(state, "email")
  const emailError = validators.getError(state, "email")
  const hasPasswordError = validators.hasError(state, "password")
  const passwordError = validators.getError(state, "password")
  const hasGroupsError = validators.hasError(state, "groups")
  const groupsError = validators.getError(state, "groups")

  const isDirty = Object.keys(dirty).length > 0
  const hasChanges = Object.keys(changes).length > 0
  const allowSubmit = !isFetching && !isSaving && !hasErrors && !isDirty && hasChanges
  const showStatus = (isSaving || isValidating || isFetching) && !hideStatus
  const status = isSaving ? "Saving Changes" : isValidating ? "Validating Changes" : "Fetching Data"

  // emit("render", { allowSubmit, showStatus, ...(isFetching && { isFetching }), ...(isSaving && { isSaving }), ...(hasErrors && { hasErrors }), ...(isDirty && { isDirty }), ...(!hasChanges && { hasChanges }) })

  useEffect(
    function emailEffect() {
      if (email && dirty.email && !hasEmailError && !isSaving) {
        emit("emailEffect triggered")
        const timeout = setTimeout(() => dispatch({ type: "emailAfterDelay" }), process.env.VALIDATION_DELAY_MS)
        return () => clearTimeout(timeout)
      }
      // emit("emailEffect skipped", { ...(!email && { email }), ...(!dirty.email && { dirty: dirty.email }), ...(hasEmailError && { hasEmailError }), ...(isSaving && { isSaving }) })
    },
    [email, dirty.email, hasEmailError, isSaving]
  )

  useEffect(
    function passwordEffect() {
      if (password && dirty.password && !hasPasswordError && !isSaving) {
        emit("passwordEffect triggered")
        const timeout = setTimeout(() => dispatch({ type: "passwordAfterDelay" }), process.env.VALIDATION_DELAY_MS)
        return () => clearTimeout(timeout)
      }
      // emit("passwordEffect skipped", { ...(!password && { password }), ...(!dirty.password && { dirty: dirty.password }), ...(hasPasswordError && { hasPasswordError }), ...(isSaving && { isSaving }) })
    },
    [password, dirty.password, hasPasswordError, isSaving]
  )

  useEffect(
    function showStatusEffect() {
      if (hideStatus) {
        emit("showStatusEffect triggered")
        const timeout = setTimeout(() => dispatch({ type: "showStatus" }), process.env.VALIDATION_DELAY_MS)
        return () => clearTimeout(timeout)
      }
      // emit("showStatusEffect skipped", { hideStatus })
    },
    [hideStatus]
  )

  useEffectOnWindowFocus(() => {
    auth.on("checkAuthEffect success", () => {
      dispatch({ type: "fetchData", hideStatus: true })
    })
  }, [])

  useEffect(() => {
    if (!username) {
      return
    }
    dispatch({ type: "fetchData" })
    on("fetchSuccess", () => dispatch({ type: "resetForm" }))
  }, [username])

  useEffect(() => {
    if (!fetchOrdinal) {
      return
    }
    dispatch({ type: "fetchStarted" })
    return onCancel(
      API.getUser({ params: username }, res => {
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
      })
    )
  }, [fetchOrdinal])

  useEffect(() => {
    if (!saveOrdinal) {
      return
    }
    dispatch({ type: "saveStarted" })
    return onCancel(
      API.putUser({ data: changes, params: username }, async res => {
        try {
          await auth.checkAuth()
        } catch {
          dispatch({ type: "resetForm" })
          return
        }
        if (res.data?.success) {
          dispatch({ type: "saveSuccess", data: res.data.data })
        } else if (res.data?.errors) {
          dispatch({ type: "formErrors", errors: res.data.errors })
        } else {
          flashMessage(res.data?.message ?? "Unknown error occured. Please try again later.", "danger")
        }
        dispatch({ type: "saveFinished" })
      })
    )
  }, [saveOrdinal])

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
