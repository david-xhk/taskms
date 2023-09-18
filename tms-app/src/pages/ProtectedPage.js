import React from "react"

import { hasIntersection } from "tms-all/helpers/arrayHelper"
import LoadingDots from "../components/LoadingDots"
import NotAuthorized from "../components/NotAuthorized"
import NotLoggedIn from "../components/NotLoggedIn"
import useAuth from "../hooks/useAuth"
import Page from "./Page"

export default function ProtectedPage(props) {
  const { children, authorization, ...restProps } = props
  const { loggedIn, currentUser } = useAuth()
  const unauthorized = authorization !== undefined && !hasIntersection(authorization, currentUser?.groups ?? [])

  return <Page {...restProps}>{loggedIn ? !unauthorized ? children : <NotAuthorized page /> : loggedIn === false ? <NotLoggedIn page /> : <LoadingDots page />}</Page>
}
