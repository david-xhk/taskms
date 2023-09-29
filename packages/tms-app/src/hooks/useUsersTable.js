import React, { useCallback, useEffect } from "react"

import User from "@han-keong/tms-types/User"
import API from "../api.js"
import useEventEmitter from "../hooks/useEventEmitter.js"
import useAuth from "./useAuth.js"
import useEffectOnWindowFocus from "./useEffectOnWindowFocus.js"
import useFlashMessage from "./useFlashMessage.js"

export default function useUsersTable() {
  const [users, setUsers] = React.useState(/** @type {User[]} */ ([]))
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
          setUsers(res.data.data.map(data => User.create(data)))
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
