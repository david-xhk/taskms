import React from "react"

import { hasIntersection } from "@han-keong/tms-helpers/arrayHelper"
import { parseOrCreateArray } from "@han-keong/tms-helpers/parseHelper"

import useAuth from "src/contexts/AuthContext/useAuth"

import LoadingDotsPage from "./LoadingDotsPage"
import NotAuthorizedPage from "./NotAuthorizedPage"
import NotFoundPage from "./NotFoundPage"
import NotLoggedInPage from "./NotLoggedInPage"
import Page from "./Page"

export default function ProtectedPage(props) {
  const { children, authorization, isLoading, notFound, ...restProps } = props

  const auth = useAuth()

  if (!auth.isChecked) {
    return <LoadingDotsPage {...restProps} />
  }

  if (!auth.isLoggedIn) {
    return <NotLoggedInPage {...restProps} />
  }

  if (!auth.currentUser) {
    return <LoadingDotsPage {...restProps} />
  }

  if (authorization !== undefined && !hasIntersection(parseOrCreateArray(authorization), auth.currentUser.groups)) {
    return <NotAuthorizedPage {...restProps} />
  }

  if (isLoading) {
    return <LoadingDotsPage {...restProps} />
  }

  if (notFound) {
    return <NotFoundPage {...restProps} />
  }

  return <Page {...restProps}>{children}</Page>
}
