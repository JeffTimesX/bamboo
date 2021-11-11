import React, { 
  useState, 
  useEffect,
  useContext 
} from 'react'

import { UserProfileContext } from '../contexts'

import { 
  Table, 
  Row, 
  Col, 
  Button 
} from 'react-bootstrap'

import { 
  AccountActionsButtonGroup,
  CreateAccountInputModal,
 } from '../components'


export default function ProfileExchangeAccounts({ userId, accounts }) {

  // get updateExchangeAccount() from Context, use it to update the exchange 
  // account list in the UserProfileContext
  const { updateExchangeAccounts } = useContext(UserProfileContext)

  const Actions = {
    create: 'create',
    popup: 'popup',
    remove: 'remove',
    history: 'history',
    none: null
  }
  
  // the trigger will be set by create, popup, remove actions to update data to backend
  const [action, setAction] = useState('')
  const [payload, setPayload] = useState({})
  
  // showing modal
  const [show, setShow] = useState(false)
  
  // set the [action] state to none to toggle off the useEffect()
  function afterUpdateCallback(updatedExchangeAccounts){
    if(!updatedExchangeAccounts.error) {
      setAction(Actions.none)
    } else {
      setAction(Actions.none)
      window.alert(updatedExchangeAccounts.error)
      console.log(updatedExchangeAccounts)
    } 
  }
  
  // write the changes happened on the exchangeAccounts to backend 
  // and userProfile context as well
  useEffect(()=>{
    
    if(action){
      // call the updateExchangeAccounts() interface referred from UserProfileContext
      // pass 'action', 'payload' to update the changes to backend as well as the 
      // userProfile context. 
      // the callback is used to update local [exchangeAccounts] state after
      // the userProfile context is updated.
      // watch what does happen on the local exchangeAccounts[] if I don't 
      // call the setExchangeAccounts() in the callback
      updateExchangeAccounts(action, payload, afterUpdateCallback )  
    }

  },[action])
  
  // it is called by input modal's cancel or confirm button,
  // action, accountNumber, balance params passed in.
  // it builds the payload, and set [action] state to trigger 
  // the useEffect() to call the updateExchangeAccounts() which
  // provided by UserProfileContext to work with backend API.
  function handleAddModalInput(action, accountNumber, balance){
    // window.alert(action + accountNumber + balance)
    switch(action){
      case 'confirm': {       
        // create the payload 
        setPayload({
          user: userId,
          account_number: accountNumber,
          value: parseFloat(balance)
        })
        // trigger useEffect() to updateExchangeAccounts() with payload
        setAction(Actions.create)
        break
      }
      case 'cancel':{
        setPayload({})
        setAction(Actions.none)
        break
      }
      case 'close':{
        setPayload({})
        setAction(Actions.none)
        break
      }
      default: break 
    }
    setShow(false)
  }


  function handleAddButtonOnClick(e){
    e.preventDefault()
    //calling out a modal and asking user to input accountId and 
    setShow(true)
  }
  
  // call the removeExchangeAccount() function to remove
  function handleDelete(accountId){
    setPayload({
      user: userId, 
      accountId: accountId, 
      account_number: accounts.filter(account => account._id === accountId)[0].account_number
    })
    setAction(Actions.remove)

  }

  function handleHistory(accountId){
    window.alert('history')
  }

  function handlePopup(accountId, amount){
    setPayload({
      user: userId, 
      accountId: accountId,
      account_number: accounts.filter(account => account._id === accountId)[0].account_number,   
      value: parseFloat(amount)
    })
    setAction(Actions.popup)
  }

  function handleGroupButtonsOnClick (e) {
    e.preventDefault()
    switch (e.target.name) {
      case 'delete': handleDelete(e.target.id); break
      case 'history': handleHistory(e.target.id); break
      case 'popup': handlePopup(e.target.id, 99999); break
      default: window.alert('nothing')
    }
  }


return (
  <Row className="p-2 justify-content-center">
    <Col sm={12} md={8} lg={8} xl={8}>
      <h3>Exchange Accounts</h3>
    </Col>
    <Col sm={12} md={4} lg={4} xl={4}>
      <Button 
        variant="success"
        name='add-exchange-account'
        onClick={handleAddButtonOnClick}
      >
        Add Account
      </Button>
      <CreateAccountInputModal 
        show={show} 
        handleAddModalInput={handleAddModalInput}
      />
    </Col>
    <Table striped bordered hover variant=''>
      <thead>
        <tr key='exchange-account-table-head'>
          <th>#</th>
          <th>Account Number</th>
          <th>Balance</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {
          accounts && accounts.map((account, index) => {
            return (
              <tr key={account._id}>
                <td>{index +1}</td>
                <td>{account.account_number}</td>
                <td>{account.balance}</td>
                <td>
                  <AccountActionsButtonGroup 
                    onButtonClick={handleGroupButtonsOnClick}
                    accountId={account._id}
                  />
                </td>
              </tr>
            )
          })
        }
      </tbody>
    </Table>
  </Row>

)
}