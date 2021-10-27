import { Nav, Button, Form, FormControl } from 'react-bootstrap';

export default function SearchNav(){
  return (
    <Nav className="ms-auto">
      <Form className="d-flex">
        <FormControl
          type="search"
          placeholder="IBM"
          style={{ "background-color":"black"}}
          className="me-2"
          aria-label="Search"
        />
        <Button variant="outline-light">Search</Button>
      </Form>
    </Nav>
  )
}
