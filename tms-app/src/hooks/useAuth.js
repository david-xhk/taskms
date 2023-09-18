import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

import API from "../api"
import useEffectEveryInterval from "./useEffectEveryInterval"
import useEffectOnWindowFocus from "./useEffectOnWindowFocus"
import useEventEmitter from "./useEventEmitter"
import useFlashMessage from "./useFlashMessage"

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [checkOrdinal, setCheckOrdinal] = useState(0)

  const { emit, onCancel } = useEventEmitter("useAuth")
  const flashMessage = useFlashMessage()

  useEffectOnWindowFocus(() => setCheckOrdinal(x => x + 1), [])

  useEffectEveryInterval(() => setCheckOrdinal(x => x + 1), 1000 * 60) // 1 minute

  useEffect(
    function checkAuthEffect() {
      emit("checkAuthEffect")
      return onCancel(
        API.getCurrentUser(res => {
          if (res.data?.success) {
            emit("checkAuthEffect success")
            onLogin(res.data.data)
          } else if (res.status === 401 || res.status === 403) {
            emit("checkAuthEffect error", res.status)
            onLogout()
            if (res.status === 403) {
              if (res.data?.message) {
                flashMessage(res.data.message, "danger")
              }
              API.logout()
            }
          } else {
            emit("checkAuthEffect fail")
            flashMessage(res.data?.message ?? "Unknown error occured. Please try again later.", "danger")
          }
        })
      )
    },
    [checkOrdinal]
  )

  const onLogin = useCallback(function onLogin(user) {
    setLoggedIn(true)
    setCurrentUser(user)
  }, [])

  const onLogout = useCallback(function onLogout() {
    setLoggedIn(false)
    setCurrentUser(null)
  }, [])

  return <AuthContext.Provider value={{ loggedIn, currentUser, checkOrdinal, onLogin, onLogout }}>{children}</AuthContext.Provider>
}

export default function useAuth() {
  const { loggedIn, currentUser, onLogin, onLogout } = useContext(AuthContext)
  const { emit, on, cancelAll, onCancel } = useEventEmitter("useAuth")
  const flashMessage = useFlashMessage()

  const methods = useMemo(
    () => ({
      register(username, email, password, onError) {
        emit("register")
        return onCancel(
          API.register({ data: { username, email, password } }, res => {
            if (res.data?.success) {
              emit("register success")
              onLogin(res.data.data)
              flashMessage("🚀 Welcome aboard!", "success")
            } else if (onError && res.data?.errors) {
              emit("register error")
              onError(res.data.errors)
            } else {
              emit("register fail")
              flashMessage(res.data?.message ?? "Unknown error occured. Please try again later.", "danger")
            }
          })
        )
      },

      login(username, password) {
        emit("login")
        return onCancel(
          API.login({ data: { username, password } }, res => {
            if (res.data?.success) {
              emit("login success")
              onLogin(res.data.data)
              flashMessage("🎉 Welcome back!", "info")
            } else {
              emit("login fail")
              flashMessage(res.data?.message ?? "Unknown error occured. Please try again later.", "danger")
            }
          })
        )
      },

      checkAuth() {
        emit("checkAuth")
        return new Promise((resolve, reject) => {
          onCancel(
            API.getCurrentUser(res => {
              if (res.data?.success) {
                emit("checkAuth success")
                onLogin(res.data.data)
                resolve()
              } else if (res.status === 401 || res.status === 403) {
                emit("checkAuth error", res.status)
                onLogout()
                if (res.status === 403) {
                  if (res.data?.message) {
                    flashMessage(res.data.message, "danger")
                  }
                  API.logout(() => reject())
                } else {
                  reject()
                }
              } else {
                emit("checkAuth fail")
                flashMessage(res.data?.message ?? "Unknown error occured. Please try again later.", "danger")
                reject()
              }
            })
          )
        })
      },

      logout() {
        emit("logout")
        return onCancel(
          API.logout(res => {
            if (res.data?.success) {
              emit("logout success")
              onLogout()
              flashMessage("👋 Until next time!", "info")
            } else {
              emit("logout fail")
              flashMessage(res.data?.message ?? "Unknown error occured. Please try again later.", "danger")
            }
          })
        )
      }
    }),
    []
  )

  return { loggedIn, currentUser, on, cancelAll, ...methods }
}
