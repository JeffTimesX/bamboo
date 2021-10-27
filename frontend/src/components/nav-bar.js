
import {Container, Navbar, Nav, Form, FormControl, Button} from 'react-bootstrap';

import { MainNav, SearchNav, AuthNav } from '../components'

export default function NavBar() {

  return (
    
      <Navbar sticky="top" expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">
            <img
              alt="Bamboo"
              src="/bamboo_logo.png"
              width="100"
              height="40"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <MainNav />
            <SearchNav />
            <AuthNav />
          </Navbar.Collapse>
        </Container>
      </Navbar>
    
  )
}
