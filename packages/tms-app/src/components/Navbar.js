import React, { useCallback, useState } from "react"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import Nav from "react-bootstrap/Nav"
import BsNavbar from "react-bootstrap/Navbar"
import { useMediaQuery } from "react-responsive"
import { Link, useLocation, useNavigate } from "react-router-dom"

import Truncate from "src/components/Truncate"
import useAuth from "src/contexts/AuthContext/useAuth"
import useFlashMessage from "src/contexts/FlashMessageContext/useFlashMessage"

export default function Navbar(props) {
  const [expanded, setExpanded] = useState(false)

  const activeKey = useLocation().pathname.split("/", 2).join("/")
  const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" })

  const auth = useAuth()
  const navigate = useNavigate()
  const flashMessage = useFlashMessage()

  const onSelect = useCallback(() => {
    if (isSmallScreen) {
      setExpanded(false)
    }
  }, [isSmallScreen])

  const onToggle = useCallback(() => setExpanded(x => !x), [])

  /** @param {React.FormEvent<HTMLFormElement>} event */
  const onLogin = async event => {
    event.preventDefault()
    if (await auth.login()) {
      onSelect()
      flashMessage("Welcome back!", "info")
    }
  }

  const onLogout = async () => {
    if (await auth.logout()) {
      flashMessage("Until next time!", "info")
      navigate("/")
    }
  }

  return (
    <BsNavbar expand="md" bg="primary" className="sticky-md-top px-3 py-2" data-bs-theme="dark" style={{ minHeight: 50 }} expanded={expanded}>
      <Container fluid className="flex-md-nowrap p-0">
        <BsNavbar.Brand className="m-0 px-2 py-0" as={Link} to="/">
          {isSmallScreen ? "TMS" : "Task Management System"}
        </BsNavbar.Brand>
        {!props.static && auth.isChecked && (
          <>
            <BsNavbar.Toggle className="fs-6 px-2 py-1" onClick={onToggle} />
            <BsNavbar.Collapse className="justify-content-end">
              {!auth.isLoggedIn ? (
                <Form className="d-flex gap-2 flex-wrap mt-2 flex-md-nowrap mt-md-0" onSubmit={onLogin}>
                  <Form.Control size="sm" type="text" placeholder="Username" autoComplete="off" value={auth.username.value} onChange={auth.username.onChange} isInvalid={auth.username.invalid} />
                  <Form.Control size="sm" type="password" placeholder="Password" autoComplete="off" value={auth.password.value} onChange={auth.password.onChange} isInvalid={auth.password.invalid} />
                  <Button size="sm" type="submit" className="icon-link" variant="success">
                    <i className="fas fa-sign-in-alt"></i>
                    Login
                  </Button>
                </Form>
              ) : (
                <>
                  <Nav className="mb-2 mb-md-0 me-0 me-md-auto" activeKey={activeKey} onSelect={onSelect}>
                    <Nav.Link className="icon-link fs-6 px-2 py-1" eventKey="/" as={Link} to={"/"}>
                      <i className="fas fa-home" style={{ width: "1rem" }}></i>
                      Home
                    </Nav.Link>
                    <Nav.Link className="icon-link fs-6 px-2 py-1" eventKey="/apps" as={Link} to={"/apps"}>
                      <i className="fas fa-sitemap" style={{ width: "1rem" }}></i>
                      Apps
                    </Nav.Link>
                    {auth?.isAdmin && (
                      <Nav.Link className="icon-link fs-6 px-2 py-1" eventKey="/users" as={Link} to={"/users"}>
                        <i className="fas fa-users" style={{ width: "1rem" }}></i>
                        Users
                      </Nav.Link>
                    )}
                  </Nav>
                  <Nav activeKey={activeKey} onSelect={onSelect}>
                    <BsNavbar.Text className="fs-6 px-2 py-1 text-white">
                      <Truncate text={auth.username.value} length={10} />
                    </BsNavbar.Text>
                    <div className="vr d-none d-md-block mx-1"></div>
                    <hr className="d-block d-md-none mt-0 mb-1" />
                    <Nav.Link className="icon-link fs-6 px-2 py-1" eventKey="/account" as={Link} to={"/account"}>
                      <i className="fas fa-user" style={{ width: "1rem" }}></i>
                      Account
                    </Nav.Link>
                    <Nav.Link className="icon-link fs-6 px-2 py-1" onClick={onLogout}>
                      <i className="fas fa-sign-out-alt" style={{ width: "1rem" }}></i>
                      Logout
                    </Nav.Link>
                  </Nav>
                </>
              )}
            </BsNavbar.Collapse>
          </>
        )}
      </Container>
    </BsNavbar>
  )
}
