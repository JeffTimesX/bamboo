import { Nav, Button, Form, FormControl } from 'react-bootstrap';

import { useState } from 'react'

import { useHistory } from 'react-router-dom'
export default function SearchNav(){
  
  const [search, setSearch] =  useState('IBM')
  const history = useHistory()
  
  function handleInputChange(e) {
    setSearch(e.target.value.toUpperCase())
  }

  function handleButtonOnClick(e) {
    history.push('/ticker-detail/' + search)
  }

  return (
    <Nav className="ms-auto">
      <Form className="d-flex">
        <FormControl
          type="search"
          placeholder={search}
          value={search}
          style={{ "backgroundColor":"black", "color":"white"}}
          className="me-2"
          aria-label="Search"
          onChange={handleInputChange}
        />
        <Button 
          variant="outline-light"
          onClick={handleButtonOnClick}
        >
          Search
        </Button>
      </Form>
    </Nav>
  )
}
