import { Nav, Button } from 'react-bootstrap'

import AuthenticationButton from './authentication-button';

export default function AuthNav(){

  return (
    <Nav className="ms-auto">
      <AuthenticationButton />
      
    </Nav>
  )
}

//<Button variant="outline-success">
//        Login
//      </Button>