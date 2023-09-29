import { useCallback, useEffect } from "react"
import { useImmerReducer } from "use-immer"

import { validateGroup, validateGroups } from "@han-keong/tms-validators/groupValidator"
import { validateEmail, validateEmailDelayed, validateEmailImmediately, validatePassword, validatePasswordDelayed, validatePasswordImmediately, validateUsername, validateUsernameDelayed, validateUsernameImmediately } from "@han-keong/tms-validators/userValidator"
import * as validators from "@han-keong/tms-validators/validators"

import api from "../api.js"
import config from "../config.js"
import useAuth from "./useAuth.js"
import useEventEmitter from "./useEventEmitter.js"
import useFlashMessage from "./useFlashMessage.js"

const initialState = {
  username: "",
  email: "",
  password: "",
  active: false,
  groups: [],
  dirty: {},
  data: {},
  result: {},
  isValidating: false,
  isSaving: false,
  saveOrdinal: 0
}

export default function useCreateProfile() {
  const auth = useAuth()
  const { emit, on, cancelAll, onCancel } = useEventEmitter("useCreateProfile")
  const flashMessage = useFlashMessage()

  function reducer(draft, action) {
    switch (action.type) {
      case "usernameImmediately":
        validators.deleteError(draft.result, "username")
        draft.username = action.value
        delete draft.data.username
        if (draft.username) {
          draft.dirty.username = true
          draft.isValidating = validateUsernameImmediately(draft.username, draft.result)
        } else {
          delete draft.dirty.username
          draft.isValidating = false
        }
        break

      case "usernameAfterDelay":
        draft.isValidating = false
        if (validateUsernameDelayed(draft.username, draft.result)) {
          draft.data.username = draft.username
          delete draft.dirty.username
        }
        break

      case "emailImmediately":
        validators.deleteError(draft.result, "email")
        draft.email = action.value
        delete draft.data.email
        if (draft.email) {
          draft.dirty.email = true
          draft.isValidating = validateEmailImmediately(draft.email, draft.result)
        } else {
          delete draft.dirty.email
          draft.isValidating = false
        }
        break

      case "emailAfterDelay":
        draft.isValidating = false
        if (validateEmailDelayed(draft.email, draft.result)) {
          draft.data.email = draft.email
          delete draft.dirty.email
        }
        break

      case "passwordImmediately":
        validators.deleteError(draft.result, "password")
        draft.password = action.value
        delete draft.data.password
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
          draft.data.password = draft.password
          delete draft.dirty.password
        }
        break

      case "activeChanged":
        draft.active = draft.data.active = action.value
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
        delete draft.data.groups
        if (draft.groups.length === 0 || validateGroups(draft.groups, draft.result)) {
          draft.data.groups = [...draft.groups]
        }
        break

      case "saveData":
        validateUsername(draft.data.username, draft.result)
        if (draft.data.email) {
          validateEmail(draft.data.email, draft.result)
        }
        validatePassword(draft.data.password, draft.result)
        if (draft.data.groups) {
          validateGroups(draft.data.groups, draft.result)
        }
        if (!validators.hasErrors(draft.result)) {
          draft.saveOrdinal++
        }
        break

      case "saveStarted":
        draft.isSaving = true
        break

      case "saveFinished":
        draft.isSaving = false
        break

      case "formErrors":
        validators.setErrors(draft.result, action.errors)
        break

      case "resetForm":
        draft.username = ""
        draft.email = ""
        draft.password = ""
        draft.active = false
        draft.groups = []
        draft.dirty = {}
        draft.data = {}
        validators.deleteErrors(draft.result)
        draft.isValidating = false
        draft.isSaving = false
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
    const data = Object.keys(draft.data)
    if (data.length > 0) {
      state.data = data.join(", ")
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
  const { username, email, password, active, groups, dirty, data, isValidating, isSaving, saveOrdinal } = state

  const hasErrors = validators.hasErrors(state.result)
  const errors = validators.getErrors(state.result)
  const hasUsernameError = validators.hasError(state.result, "username")
  const usernameError = validators.getError(state.result, "username")
  const hasEmailError = validators.hasError(state.result, "email")
  const emailError = validators.getError(state.result, "email")
  const hasPasswordError = validators.hasError(state.result, "password")
  const passwordError = validators.getError(state.result, "password")
  const hasGroupsError = validators.hasError(state.result, "groups")
  const groupsError = validators.getError(state.result, "groups")

  const isDirty = Object.keys(dirty).length > 0
  const hasRequireddata = data.username && data.password
  const allowSubmit = !isSaving && !hasErrors && !isDirty && hasRequireddata
  const showStatus = isSaving || isValidating
  const status = isSaving ? "Creating Profile" : "Validating data"

  // emit("render", { allowSubmit, showStatus, ...(isSaving && { isSaving }), ...(hasErrors && { hasErrors }) })

  useEffect(
    function usernameEffect() {
      if (username && dirty.username && !hasUsernameError && !isSaving) {
        emit("usernameEffect triggered")
        const timeout = setTimeout(() => dispatch({ type: "usernameAfterDelay" }), config.VALIDATION_DELAY_MS)
        return () => clearTimeout(timeout)
      }
      // emit("usernameEffect skipped", { ...(!username && { username }), ...(!dirty.username && { dirty: dirty.username }), ...(hasUsernameError && { hasUsernameError }), ...(isSaving && { isSaving }) })
    },
    [username, dirty.username, hasUsernameError, isSaving]
  )

  useEffect(
    function emailEffect() {
      if (email && dirty.email && !hasEmailError && !isSaving) {
        emit("emailEffect triggered")
        const timeout = setTimeout(() => dispatch({ type: "emailAfterDelay" }), config.VALIDATION_DELAY_MS)
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
        const timeout = setTimeout(() => dispatch({ type: "passwordAfterDelay" }), config.VALIDATION_DELAY_MS)
        return () => clearTimeout(timeout)
      }
      // emit("passwordEffect skipped", { ...(!password && { password }), ...(!dirty.password && { dirty: dirty.password }), ...(hasPasswordError && { hasPasswordError }), ...(isSaving && { isSaving }) })
    },
    [password, dirty.password, hasPasswordError, isSaving]
  )

  useEffect(() => {
    if (!saveOrdinal) {
      return
    }
    dispatch({ type: "saveStarted" })
    return onCancel(
      api.postUser({ data }, async res => {
        try {
          await auth.checkAuth()
        } catch {
          dispatch({ type: "resetForm" })
          return
        }
        if (res.data?.success) {
          flashMessage("👤 Profile created!", "success")
          dispatch({ type: "resetForm" })
          return
        }
        if (res.data?.errors) {
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

  const onUsernameChanged = useCallback(dispatchFieldChanged("usernameImmediately"), [])

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
        dispatch({ type: "saveData" })
      }
    },
    [hasErrors]
  )

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
    username,
    email,
    password,
    active,
    groups,
    dirty,
    data,
    isValidating,
    isSaving,
    hasErrors,
    errors,
    hasUsernameError,
    usernameError,
    hasEmailError,
    emailError,
    hasPasswordError,
    passwordError,
    hasGroupsError,
    groupsError,
    isDirty,
    hasRequireddata,
    allowSubmit,
    showStatus,
    status,
    cancelAll,
    onUsernameChanged,
    onEmailChanged,
    onPasswordChanged,
    onActiveChanged,
    onGroupsChanged,
    onGroupChanged,
    onErrors,
    handleSubmit,
    reset
  }
}
