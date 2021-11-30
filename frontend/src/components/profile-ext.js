import { 
  Button,
  Row,
  Col, 
  Container,
  InputGroup, 
  FormControl, 
  Dropdown, 
  DropdownButton} from 'react-bootstrap'

import {DateTime} from 'luxon'


export default function ProfileExt({
  extProfile, 
  handleInputChange, 
  handleDropdownSelect,
  handleSave,
}) {

  return extProfile ? ( 
    <Container>
      <Row xs={1} md={2} className="p-2 justify-content-center">
        <Col className="d-flex justify-content-start">
          <h5>General Information</h5>
        </Col>
        <Col className="d-flex justify-content-end">
        {/* save change button */}
          <Button 
          variant="outline-success"
          onClick={handleSave}
          >
            Save Changes
          </Button>
        </Col>
      </Row>
      <Row xs={1} md={2} className="p-2 justify-content-center ">
        <Col key='first_name'>
          <InputGroup className="mb-4">
            <InputGroup.Text 
              id="profile-ext-first-name" 
              style={{
                color:'black', 
                boardColor:'#c1c7c7',
                backgroundColor:'white'
              }}
            >
              First Name
            </InputGroup.Text>
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
            <InputGroup.Text 
              id="profile-ext-first-name" 
              style={{
                color:'black', 
                boardColor:'#c1c7c7',
                backgroundColor:'white'
              }}
            >
              Last Name
            </InputGroup.Text>
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
            <InputGroup.Text 
              id="profile-ext-first-name" 
              style={{
                color:'black', 
                boardColor:'#c1c7c7',
                backgroundColor:'white'
              }}
            >
              Date of Birth
            </InputGroup.Text>
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
              variant="outline-secondary"
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
              style={{backgroundColor:'white'}} 
              placeholder={extProfile.gender.toString()}
              readOnly
              />
              
          </InputGroup>
        </Col>
      </Row>
    </Container>
  ) : null
}



  