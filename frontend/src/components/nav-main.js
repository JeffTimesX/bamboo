import {LinkContainer} from 'react-router-bootstrap'
import {Nav} from 'react-bootstrap'

export default function MainNav() {
  return (
    <Nav className="me-auto">
      <LinkContainer to='/portfolio'>
        <Nav.Link className="ms-3">Portfolio</Nav.Link>
      </LinkContainer>
      <LinkContainer to='/watches'>
        <Nav.Link className="ms-3">Watches</Nav.Link>
      </LinkContainer>  
      <LinkContainer to='/post'>
        <Nav.Link className="ms-3">Stockers</Nav.Link>
      </LinkContainer>
      <LinkContainer to='/profile'>
        <Nav.Link className="ms-3">Account</Nav.Link>
      </LinkContainer>
    </Nav>
  )
}

