import React, {useState} from 'react'

import {
  Modal, 
  Row,  
  Button, 
  Container, 
  InputGroup, 
  FormControl
} from 'react-bootstrap'

export default function CreateAccountInputModal({show, handleAddModalInput}) {
  
  const [accountNumber,  setAccountNumber] = useState(0);
  const [balance, setBalance] = useState(0);
  
  const handleClose = (e) => {
    e.preventDefault()
    handleAddModalInput(e.target.name, accountNumber, balance)
  };
  const handleConfirm = (e) => {
    e.preventDefault()
    handleAddModalInput(e.target.name, accountNumber, balance)
    
  }
  const handleHide = () => {
    handleAddModalInput('close', accountNumber, balance)
  }

  return (
    <>
      <Modal
        show={show}
        onHide={handleHide}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Exchange Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
          <Row>
            <InputGroup className="mb-3">
              <InputGroup.Text id="exchange-create-account-number">Account Number</InputGroup.Text>
              <FormControl
                placeholder="9998886666"
                value={accountNumber}
                onChange={(e)=>setAccountNumber(e.target.value)}
              />
            </InputGroup>
          </Row>
          <Row>
            <InputGroup className="mb-3">
              <InputGroup.Text id="exchange-create-account-number">Init Balance</InputGroup.Text>
              <FormControl
                placeholder="0.00"
                value={balance}
                onChange={(e)=>setBalance(e.target.value)}
              />
            </InputGroup>
          </Row>
        </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            name='cancel'
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button 
            variant="primary"
            name='confirm'
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
