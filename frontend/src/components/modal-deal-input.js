import React, {
  useState, 
  useEffect
} from 'react'

import {
  Modal, 
  Row,  
  Button, 
  Container, 
  InputGroup, 
  FormControl,
  Form
} from 'react-bootstrap'

export default function DealInputModal({
  show,
  tickerSymbol, 
  action, 
  initPrice, 
  initAmount, 
  initAccounts, 
  handleDealInput}) {
  
  const [price,  setPrice] = useState(0);
  const [amount, setAmount] = useState(0);
  const [accountId, setAccountId] = useState('');
  
  // always initialize the local state with the useEffect() 
  // it protects the local state is populated.
  useEffect(() => {
    setPrice(initPrice)
    setAmount(initAmount)
    initAccounts && setAccountId(initAccounts[0]._id)
  },[initPrice, initAmount, initAccounts])

  // // amount changes with the selected account.
  // useEffect(() => {
    
  // },[setAccount])

  function createFilledInputs(){
    const filledInputs = {
      ticker: tickerSymbol,
      price: price, 
      amount: amount, 
      accountId: accountId,
    }
    return filledInputs;
  }

  const handleClose = (e) => {
    e.preventDefault()
    handleDealInput('cancel', null)
  }

  const handleConfirm = (e) => {
    e.preventDefault()
    handleDealInput(action, createFilledInputs())
  }

  const handleHide = () => {
    handleDealInput('close', null)
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
          <Modal.Title>{action && action[0].toUpperCase() + action.slice(1) + ' ' + tickerSymbol}
    </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
          <Row>
            <InputGroup className="mb-3">
              <InputGroup.Text id="deal-input-price">Price</InputGroup.Text>
              <FormControl
                placeholder={initPrice}
                value={price}
                onChange={(e)=>setPrice(e.target.value)}
              />
            </InputGroup>
          </Row>
          <Row>
            <InputGroup className="mb-3">
              <InputGroup.Text id="deal-input-amount">Amount</InputGroup.Text>
              <FormControl
                placeholder={initAmount}
                value={amount}
                onChange={(e)=>setAmount(e.target.value)}
              />
            </InputGroup>
          </Row>
          <Row>
            <InputGroup className="mb-3">
              <InputGroup.Text id="deal-input-accounts">Account</InputGroup.Text>
              <Form.Select 
                aria-label="Default select example"
                onChange={(e)=>{
                  setAccountId(e.target.value)
                  const account = initAccounts && initAccounts.filter((account) => account._id === e.target.value)[0]
                  const ticker = account.tickers.filter((t) => t.ticker === tickerSymbol)[0]
                  const amount = ticker ? ticker.amount : 0
                  setAmount(amount)
                }}
              >
                <option>Select an account</option>
                { initAccounts && initAccounts.map(account => (
                  <option 
                    key={account._id} 
                    value={account._id}>
                      {account.account_number}
                  </option>
                ))}
              </Form.Select>
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
