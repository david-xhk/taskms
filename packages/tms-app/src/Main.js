import React, { Suspense } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import Footer from "./components/Footer.js"
import Header from "./components/Header.js"
import { AuthProvider } from "./hooks/useAuth.js"
import { EventEmitterProvider } from "./hooks/useEventEmitter.js"
import { FlashMessageProvider } from "./hooks/useFlashMessage.js"
import AboutPage from "./pages/AboutPage.js"
import CreateProfilePage from "./pages/CreateProfilePage.js"
import EditProfilePage from "./pages/EditProfilePage.js"
import HomePage from "./pages/HomePage.js"
import LoadingDotsPage from "./pages/LoadingDotsPage.js"
import ManageUsersPage from "./pages/ManageUsersPage.js"
import NotFoundPage from "./pages/NotFoundPage.js"
import TermsPage from "./pages/TermsPage.js"

function Main() {
  return (
    <EventEmitterProvider>
      <FlashMessageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Header />
            <Suspense fallback={<LoadingDotsPage />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/users" element={<ManageUsersPage />} />
                <Route path="/users/new" element={<CreateProfilePage />} />
                <Route path="/user" element={<EditProfilePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
            <Footer />
          </BrowserRouter>
        </AuthProvider>
      </FlashMessageProvider>
    </EventEmitterProvider>
  )
}

const app = document.querySelector("#app")
if (app) {
  const root = ReactDOM.createRoot(app)
  root.render(<Main />)
}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
}
