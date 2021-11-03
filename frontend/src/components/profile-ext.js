import { 
  Col, 
  InputGroup, 
  FormControl, 
  Dropdown, 
  DropdownButton} from 'react-bootstrap'

import {DateTime} from 'luxon'

export default function ProfileExt({extProfile, handleInputChange, handleDropdownSelect}) {

  return extProfile ? ( 
    <>
    <Col key='first_name'>
      <InputGroup className="mb-4">
        <InputGroup.Text id="profile-ext-first-name" className='bg-secondary' style={{color:'white'}}>First Name:</InputGroup.Text>
        <FormControl
          placeholder="John"
          type="text"
          aria-label="first name"
          name="first_name"
          value={extProfile.first_name}
          onChange={handleInputChange}
        />
      </InputGroup>
    </Col>
    <Col key='last_name'>
      <InputGroup className="mb-4">
        <InputGroup.Text id="profile-ext-first-name" className='bg-secondary' style={{color:'white'}}>Last Name:</InputGroup.Text>
        <FormControl
          placeholder="Smith"
          type="text"
          aria-label="last name"
          name="last_name"
          value={extProfile.last_name}
          onChange={handleInputChange}
        />
      </InputGroup>
    </Col>
    <Col key='date_of_birth'>
      <InputGroup className="mb-4">
        <InputGroup.Text id="profile-ext-first-name" className='bg-secondary' style={{color:'white'}}>Date of Birth:</InputGroup.Text>
        <FormControl
          type="date"
          aria-label="date of birth"
          name="date_of_birth"
          value={DateTime.fromISO(extProfile.date_of_birth).toISODate()}
          onChange={handleInputChange}
        />
      </InputGroup>
    </Col>
    <Col key='gender'>
      <InputGroup className="mb-4">
        <DropdownButton
          variant="outline-light"
          title="Gender"
          onSelect={handleDropdownSelect}
        >
          <Dropdown.Item name='gender' eventKey='male'>Male</Dropdown.Item>
          <Dropdown.Item name='gender' eventKey='female'>Female</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item name='gender' eventKey='unknown'>Unknown</Dropdown.Item>
        </DropdownButton>
        <FormControl 
          aria-label="Gender" 
          style={{color:'gray'}} 
          placeholder={extProfile.gender.toString()}
          readOnly
          />
          
      </InputGroup>
    </Col>
    </>
  ) : null
}



  