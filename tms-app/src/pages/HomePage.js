import React from "react"

import LoadingDots from "../components/LoadingDots"
import useAuth from "../hooks/useAuth"
// import NotLoggedInPage from "./NotLoggedInPage"
import ProtectedPage from "./ProtectedPage"
import RegisterPage from "./RegisterPage"

export default function HomePage() {
  const auth = useAuth()

  if (!auth.loggedIn) {
    return <RegisterPage />
    // return <NotLoggedInPage />
  }

  return (
    <ProtectedPage title="Home">
      {!auth.currentUser ? (
        <LoadingDots page />
      ) : (
        <>
          <h2>
            Welcome, <strong>{auth.currentUser.username}</strong>!
          </h2>
          <p className="lead text-muted">Your Kanban board is ready to help you manage tasks efficiently.</p>
          <p className="lead text-muted">Currently, your board is empty, but don&rsquo;t worry, you can start organizing your work right away. Tasks can be in the following states:</p>
          <ul>
            <li>
              <strong>Open</strong>: These are new tasks waiting to be picked up.
            </li>
            <li>
              <strong>To-Do</strong>: Project managers can assign tasks to development teams here.
            </li>
            <li>
              <strong>Doing</strong>: Dev team members are actively working on these tasks.
            </li>
            <li>
              <strong>Done</strong>: Tasks that have been completed but require validation or approval.
            </li>
            <li>
              <strong>Closed</strong>: Approved and finalized tasks.
            </li>
          </ul>
          <p className="lead text-muted">Stay organized and keep track of your project&rsquo;s progress using our Kanban board.</p>
        </>
      )}
    </ProtectedPage>
  )
}
