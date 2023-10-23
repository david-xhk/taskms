import React from "react"
import Card from "react-bootstrap/Card"
import { Link } from "react-router-dom"

function HomeCard(props) {
  const { children } = props
  return (
    <Card>
      <Card.Body>{children}</Card.Body>
    </Card>
  )
}

HomeCard.Title = props => {
  const { children, title } = props
  return <Card.Title className="strong">{title ?? children}</Card.Title>
}

HomeCard.Text = Card.Text

HomeCard.Link = props => {
  const { to, children } = props
  return (
    <Card.Link className="btn btn-primary" as={Link} to={to}>
      {children}
    </Card.Link>
  )
}

export default HomeCard
