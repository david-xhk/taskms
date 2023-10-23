import React, { useEffect, useState } from "react"

import useCurrentUser from "src/hooks/dataHooks/useCurrentUser"
import useLogin from "src/hooks/formHooks/useLogin"
import useLogout from "src/hooks/apiHooks/useLogout"
import useEffectOnSync from "src/hooks/useEffectOnSync"
import useInsertionCallback from "src/hooks/useInsertionCallback"

import AuthContext from "./AuthContext"

/**
 * @typedef {import("@han-keong/tms-types/User").default} User
 * @typedef {import("./AuthContext").Auth} Auth
 */

/**
 * @template T
 * @typedef {import("src/hooks/apiHooks/useApi").EndpointFunction<T>} EndpointFunction
 */

/** @param {React.PropsWithChildren} props */
export default function AuthProvider(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isChecked, setChecked] = useState(false)

  const { isSubmitting: isLoggingIn, submit: callLogin, reset: resetLogin, username, password } = useLogin()

  /** @type {EndpointFunction<boolean>} */
  const login = useInsertionCallback(async args => {
    if (isLoggedIn || isLoggingIn) {
      return false
    }
    const { showError, callbacks } = args ?? {}
    return await callLogin({
      showError,
      callbacks: [
        ...(Array.isArray(callbacks) ? callbacks : [callbacks]),
        {
          onSuccess: () => setIsLoggedIn(true)
        }
      ]
    })
  })

  const { isPending: isLoggingOut, call: callLogout } = useLogout()

  /** @type {EndpointFunction<boolean>} */
  const logout = useInsertionCallback(async args => {
    if (!isLoggedIn || isLoggingOut) {
      return false
    }
    const { showError, callbacks } = args ?? {}
    return await callLogout({
      showError,
      callbacks: [
        ...(Array.isArray(callbacks) ? callbacks : [callbacks]),
        {
          onSuccess: () => {
            setIsLoggedIn(false)
            resetLogin()
          }
        }
      ]
    })
  })

  const { data: currentUser, fetch: checkUser } = useCurrentUser({ showError: false, on: { "fetch error": logout } })

  useEffect(() => {
    const initialCheck = async () => {
      const user = await checkUser()
      if (!user) {
        setChecked(true)
        return
      }
      username.onChange(user.username)
      setIsLoggedIn(true)
    }
    initialCheck()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffectOnSync(() => {
    if (!isLoggedIn) {
      return
    }
    if (!isChecked) {
      setChecked(true)
    } else {
      checkUser()
    }
  }, [isLoggedIn])

  /** @type {EndpointFunction<boolean>} */
  const checkAdmin = useInsertionCallback(args => checkUser(args).then(user => user?.isAdmin || false))

  /** @type {EndpointFunction<boolean>} */
  const checkProjectLead = useInsertionCallback(args => checkUser(args).then(user => user?.isProjectLead || false))

  /** @type {EndpointFunction<boolean>} */
  const checkProjectManager = useInsertionCallback(args => checkUser(args).then(user => user?.isProjectManager || false))

  /** @type {(group: string, args?: Parameters<EndpointFunction<boolean>>[0]) => ReturnType<EndpointFunction<boolean>>} */
  const checkGroup = useInsertionCallback((group, args) => checkUser(args).then(user => user?.isInGroup(group) || false))

  /** @type {(groups: string[], args?: Parameters<EndpointFunction<boolean>>[0]) => ReturnType<EndpointFunction<boolean>>} */
  const checkGroups = useInsertionCallback((groups, args) => checkUser(args).then(user => user?.isInGroups(groups) || false))

  const authContext = {
    currentUser,
    isLoggedIn,
    isChecked,
    isAdmin: currentUser?.isAdmin || false,
    isProjectLead: currentUser?.isProjectLead || false,
    isProjectManager: currentUser?.isProjectManager || false,
    username,
    password,
    login,
    logout,
    checkUser,
    checkAdmin,
    checkProjectLead,
    checkProjectManager,
    checkGroup,
    checkGroups
  }

  return <AuthContext.Provider value={authContext}>{props.children}</AuthContext.Provider>
}
