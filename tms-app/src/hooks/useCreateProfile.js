import { useCallback, useEffect } from "react"
import { useImmerReducer } from "use-immer"

import { validateEmail, validateEmailDelayed, validateEmailImmediately, validateGroup, validateGroups, validatePassword, validatePasswordDelayed, validatePasswordImmediately, validateUsername, validateUsernameDelayed, validateUsernameImmediately } from "@han-keong/tms-validators"
import * as validators from "@han-keong/validators"

import API from "../api"
import useAuth from "./useAuth"
import useEventEmitter from "./useEventEmitter"
import useFlashMessage from "./useFlashMessage"

const initialState = {
  username: "",
  email: "",
  password: "",
  active: false,
  groups: [],
  dirty: {},
  fields: {},
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
        validators.deleteError(draft, "username")
        draft.username = action.value
        delete draft.fields.username
        if (draft.username) {
          draft.dirty.username = true
          draft.isValidating = validateUsernameImmediately(draft.username, draft)
        } else {
          delete draft.dirty.username
          draft.isValidating = false
        }
        break

      case "usernameAfterDelay":
        draft.isValidating = false
        if (validateUsernameDelayed(draft.username, draft)) {
          draft.fields.username = draft.username
          delete draft.dirty.username
        }
        break

      case "emailImmediately":
        validators.deleteError(draft, "email")
        draft.email = action.value
        delete draft.fields.email
        if (draft.email) {
          draft.dirty.email = true
          draft.isValidating = validateEmailImmediately(draft.email, draft)
        } else {
          delete draft.dirty.email
          draft.isValidating = false
        }
        break

      case "emailAfterDelay":
        draft.isValidating = false
        if (validateEmailDelayed(draft.email, draft)) {
          draft.fields.email = draft.email
          delete draft.dirty.email
        }
        break

      case "passwordImmediately":
        validators.deleteError(draft, "password")
        draft.password = action.value
        delete draft.fields.password
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
          draft.fields.password = draft.password
          delete draft.dirty.password
        }
        break

      case "activeChanged":
        draft.active = draft.fields.active = action.value
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
        delete draft.fields.groups
        if (draft.groups.length === 0 || validateGroups(draft.groups, draft)) {
          draft.fields.groups = [...draft.groups]
        }
        break

      case "saveStarted":
        draft.isSaving = true
        break

      case "saveFinished":
        draft.isSaving = false
        break

      case "saveData":
        validateUsername(draft.fields.username, draft)
        if (draft.fields.email) {
          validateEmail(draft.fields.email, draft)
        }
        validatePassword(draft.fields.password, draft)
        if (draft.fields.groups) {
          validateGroups(draft.fields.groups, draft)
        }
        if (!validators.hasError(draft)) {
          draft.saveOrdinal++
        }
        break

      case "formErrors":
        validators.setErrors(draft, action.errors)
        break

      case "resetForm":
        validators.deleteErrors(draft)
        draft.username = ""
        draft.email = ""
        draft.password = ""
        draft.active = false
        draft.groups = []
        draft.dirty = {}
        draft.fields = {}
        draft.isValidating = false
        draft.isSaving = false
        draft.hideStatus = false
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
    const fields = Object.keys(draft.fields)
    if (fields.length > 0) {
      state.fields = fields.join(", ")
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
  const { username, email, password, active, groups, dirty, fields, isValidating, isSaving, saveOrdinal } = state

  const hasErrors = validators.hasErrors(state)
  const errors = validators.getErrors(state)
  const hasUsernameError = validators.hasError(state, "username")
  const usernameError = validators.getError(state, "username")
  const hasEmailError = validators.hasError(state, "email")
  const emailError = validators.getError(state, "email")
  const hasPasswordError = validators.hasError(state, "password")
  const passwordError = validators.getError(state, "password")
  const hasGroupsError = validators.hasError(state, "groups")
  const groupsError = validators.getError(state, "groups")

  const isDirty = Object.keys(dirty).length > 0
  const hasRequiredFields = fields.username && fields.password
  const allowSubmit = !isSaving && !hasErrors && !isDirty && hasRequiredFields
  const showStatus = isSaving || isValidating
  const status = isSaving ? "Creating Profile" : "Validating Fields"

  // emit("render", { allowSubmit, showStatus, ...(isSaving && { isSaving }), ...(hasErrors && { hasErrors }) })

  useEffect(
    function usernameEffect() {
      if (username && dirty.username && !hasUsernameError && !isSaving) {
        emit("usernameEffect triggered")
        const timeout = setTimeout(() => dispatch({ type: "usernameAfterDelay" }), process.env.VALIDATION_DELAY_MS)
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

  useEffect(() => {
    if (!saveOrdinal) {
      return
    }
    dispatch({ type: "saveStarted" })
    return onCancel(
      API.postUser({ data: fields }, async res => {
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
        dispatch({ type: "saveData", hideStatus: true })
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
    fields,
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
    hasRequiredFields,
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
