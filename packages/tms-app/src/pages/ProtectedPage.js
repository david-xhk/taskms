import React from "react"

import { hasIntersection } from "@han-keong/tms-helpers/arrayHelper"

import LoadingDots from "../components/LoadingDots.js"
import NotAuthorized from "../components/NotAuthorized.js"
import NotLoggedIn from "../components/NotLoggedIn.js"
import useAuth from "../hooks/useAuth.js"
import Page from "./Page.js"

export default function ProtectedPage(props) {
  const { children, authorization, ...restProps } = props
  const { loggedIn, currentUser } = useAuth()
  const unauthorized = authorization !== undefined && !hasIntersection(authorization, currentUser?.groups ?? [])

  return <Page {...restProps}>{loggedIn ? !unauthorized ? children : <NotAuthorized page /> : loggedIn === false ? <NotLoggedIn page /> : <LoadingDots page />}</Page>
}
