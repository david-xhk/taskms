import React, { useCallback, useEffect } from "react"

import API from "../api"
import useEventEmitter from "../hooks/useEventEmitter"
import useAuth from "./useAuth"
import useEffectOnWindowFocus from "./useEffectOnWindowFocus"
import useFlashMessage from "./useFlashMessage"

export default function useUsersTable() {
  const [users, setUsers] = React.useState([])
  const [fetchOrdinal, setFetchOrdinal] = React.useState(0)

  const auth = useAuth()
  const { emit, on, onCancel } = useEventEmitter("useUsersTable")
  const flashMessage = useFlashMessage()

  useEffectOnWindowFocus(() => {
    auth.on("checkAuthEffect success", refresh)
  }, [])

  useEffect(() => {
    if (!auth.loggedIn) {
      return
    }
    emit("getUsersEffect")
    return onCancel(
      API.getUsers(res => {
        if (res.data?.success) {
          emit("getUsersEffect success")
          setUsers(res.data.data)
        } else {
          emit("getUsersEffect fail")
          flashMessage(res.data?.message ?? "Unknown error occured. Please try again later.", "danger")
        }
      })
    )
  }, [auth.loggedIn, fetchOrdinal])

  const refresh = useCallback((showMessage = false) => {
    setFetchOrdinal(x => x + 1)
    if (showMessage) {
      on("getUsersEffect success", () => {
        flashMessage("🔄 Users have been refreshed.", "info")
      })
    }
  }, [])

  return { users, refresh }
}
