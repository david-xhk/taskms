import React from "react"
import { Link } from "react-router-dom"

import useAuth from "../hooks/useAuth"
const HeaderLoggedIn = React.lazy(() => import("./HeaderLoggedIn"))
const HeaderLoggedOut = React.lazy(() => import("./HeaderLoggedOut"))

export default function Header(props) {
  const { loggedIn } = useAuth()

  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-sm-row align-items-center p-3">
        <h4 className="my-2 my-sm-0 mr-0 mr-sm-5 mr-md-auto font-weight-normal">
          <Link to="/" className="text-white">
            {" "}
            TMS{" "}
          </Link>
        </h4>
        {!props.static && (loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />)}
      </div>
    </header>
  )
}
