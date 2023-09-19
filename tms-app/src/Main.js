import React, { Suspense } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import Footer from "./components/Footer"
import Header from "./components/Header"
import { AuthProvider } from "./hooks/useAuth"
import { EventEmitterProvider } from "./hooks/useEventEmitter"
import { FlashMessageProvider } from "./hooks/useFlashMessage"
import AboutPage from "./pages/AboutPage"
import CreateProfilePage from "./pages/CreateProfilePage"
import EditProfilePage from "./pages/EditProfilePage"
import HomePage from "./pages/HomePage"
import LoadingDotsPage from "./pages/LoadingDotsPage"
import ManageUsersPage from "./pages/ManageUsersPage"
import NotFoundPage from "./pages/NotFoundPage"
import TermsPage from "./pages/TermsPage"

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
                <Route path="/user/:username?" element={<EditProfilePage />} />
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

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<Main />)
