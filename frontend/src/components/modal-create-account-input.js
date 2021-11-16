import React, {useState, useEffect} from 'react'

import {
  Modal, 
  Row,  
  Button, 
  Container, 
  InputGroup, 
  FormControl
} from 'react-bootstrap'

export default function CreateAccountInputModal({
  show, 
  operation, // create, popup, remove
  initAccountId,  // null or an given accountNumber
  handleModalInput}) {
  
  const [accountNumber,  setAccountNumber] = useState('');
  const [balance, setBalance] = useState(0);
  
  const handleCancel = (e) => {
    setBalance(0)
    handleModalInput(e.target.name, accountNumber, balance, operation)
  };
  const handleConfirm = (e) => {
    setBalance(0)
    handleModalInput(e.target.name, accountNumber, balance, operation) 
  }
  const handleHide = () => {
    setBalance(0)
    handleModalInput('close', accountNumber, balance, operation)
  }

  function printTitle(operation){
    if(!operation) return 'unknown'
    return operation[0].toUpperCase() + operation.slice(1) + ' Exchange Account'
  }

  useEffect(() =>{
    setAccountNumber(initAccountId)
  },[initAccountId])


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
          <Modal.Title>{printTitle(operation)}</Modal.Title>
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
              <InputGroup.Text id="exchange-create-account-number">Add Balance</InputGroup.Text>
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
            onClick={handleCancel}
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
