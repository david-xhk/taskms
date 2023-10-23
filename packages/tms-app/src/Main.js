import React, { Suspense } from "react"
import { createRoot } from "react-dom/client"
import { Outlet, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import { Tooltip } from "react-tooltip"

import Footer from "src/components/Footer"
import Navbar from "src/components/Navbar"
import AuthProvider from "src/contexts/AuthContext/AuthProvider"
import EventEmitterProvider from "src/contexts/EventEmitterContext/EventEmitterProvider"
import FlashMessageProvider from "src/contexts/FlashMessageContext/FlashMessageProvider"
import AboutPage from "src/pages/AboutPage"
import AccountPage from "src/pages/AccountPage"
import AppPage from "src/pages/AppPage"
import AppsPage from "src/pages/AppsPage"
import AppsRoot from "src/pages/AppsRoot"
import HomePage from "src/pages/HomePage"
import LoadingDotsPage from "src/pages/LoadingDotsPage"
import NotFoundPage from "src/pages/NotFoundPage"
import PlansPage from "src/pages/PlansPage"
import TermsPage from "src/pages/TermsPage"
import UsersPage from "src/pages/UsersPage"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" Component={Root}>
      <Route index Component={HomePage} />
      <Route path="apps" Component={AppsRoot}>
        <Route index Component={AppsPage} />
        <Route path=":appName">
          <Route index Component={AppPage} />
          <Route path="plans" Component={PlansPage} />
        </Route>
      </Route>
      <Route path="users" Component={UsersPage} />
      <Route path="account" Component={AccountPage} />
      <Route path="about" Component={AboutPage} />
      <Route path="terms" Component={TermsPage} />
      <Route path="*" Component={NotFoundPage} />
    </Route>
  )
)

function Root() {
  return (
    <EventEmitterProvider>
      <FlashMessageProvider>
        <AuthProvider>
          <Navbar />
          <Suspense fallback={<LoadingDotsPage />}>
            <Outlet />
          </Suspense>
          <Footer />
          <Tooltip className="custom-tooltip text-break" id="my-tooltip" place="bottom" />
        </AuthProvider>
      </FlashMessageProvider>
    </EventEmitterProvider>
  )
}

const app = document.getElementById("app")
if (app) {
  const root = createRoot(app)
  root.render(<RouterProvider router={router} />)
}

if (module.hot) {
  module.hot.accept()
}
