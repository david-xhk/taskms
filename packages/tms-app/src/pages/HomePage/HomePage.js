import React from "react"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"

import Header from "src/components/Header"
import useAuth from "src/contexts/AuthContext/useAuth"
import ProtectedPage from "src/pages/ProtectedPage"

import HomeCard from "./HomeCard"

export default function HomePage() {
  const auth = useAuth()

  return (
    <ProtectedPage title="Home">
      <Header>
        <Header.Title>
          Welcome, <strong>{auth.username.value}</strong>!
        </Header.Title>
      </Header>
      <Row className="g-3">
        {auth.isAdmin && (
          <Col xs={12} md={6} lg={4}>
            <HomeCard>
              <HomeCard.Title>Users</HomeCard.Title>
              <HomeCard.Text>Manage and create new user accounts.</HomeCard.Text>
              <HomeCard.Link to="/users">Go to Users</HomeCard.Link>
            </HomeCard>
          </Col>
        )}
        <Col xs={12} md={6} lg={4}>
          <HomeCard>
            <HomeCard.Title>Apps</HomeCard.Title>
            <HomeCard.Text>View and manage applications, plans, and tasks.</HomeCard.Text>
            <HomeCard.Link to="/apps">Go to Apps</HomeCard.Link>
          </HomeCard>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <HomeCard>
            <HomeCard.Title>My Account</HomeCard.Title>
            <HomeCard.Text>Review and update your account details.</HomeCard.Text>
            <HomeCard.Link to="/account">Go to My Account</HomeCard.Link>
          </HomeCard>
        </Col>
      </Row>
    </ProtectedPage>
  )
}
