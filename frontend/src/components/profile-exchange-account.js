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


import axios from 'axios'


export default function ProfileExchangeAccounts({ userId, accounts }) {

  // get updateExchangeAccount() from Context, use it to update the exchange 
  // account list in the UserProfileContext
  const { updateExchangeAccounts } = useContext(UserProfileContext)

  const Operations = {
    create: 'create',
    popup: 'popup',
    remove: 'remove',
    none: null
  }
  
  const Actions = {
    cancel: 'cancel',
    confirm: 'confirm',
    close: 'close', 
    none: null
  }

  
  

  // the payload be sent to backend to process.
  const [payload, setPayload] = useState({})
  
  // showing modal
  const [modalSwitch , setModalSwitch] = useState(false)

  // operations to trigger the corresponding Exchange Account actions, 
  // create, popup, remove trigger the updateExchangeAccounts()
  // history trigger the getTransactions() for all exchange accounts.
  const [operation, setOperation ] = useState(Operations.none)

  // account number pass to input modal for initializing the account number field for the popup operation
  const [accountNumberPassToPopup, setAccountNumberPassToPopup] = useState('')
  
  // set the [action] state to none to toggle off the useEffect()
  function afterUpdateCallback(updatedExchangeAccounts){
    if(!updatedExchangeAccounts.error) {
      window.alert('Exchange Account updated successfully.')
      //setOperation(Operations.none)
    } else {
      //setOperation(Actions.none)
      window.alert(updatedExchangeAccounts.error)
      console.log(updatedExchangeAccounts)
    } 
  }
  


  // write the changes happened on the exchangeAccounts to backend 
  // and userProfile context as well
  useEffect(()=>{
    
    //console.log('useEffect)() checking operation: ', operation)

    if(operation){
      console.log('useEffect() checking operation: ', operation)
      console.log("payload: ", payload)

    

      // call the updateExchangeAccounts() interface referred from UserProfileContext
      // pass 'action', 'payload' to update the changes to backend as well as the 
      // userProfile context. 
      // the callback is used to update local [exchangeAccounts] state after
      // the userProfile context is updated.
      // watch what does happen on the local exchangeAccounts[] if I don't 
      // call the setExchangeAccounts() in the callback
      updateExchangeAccounts(operation, payload, afterUpdateCallback )  
      setOperation(Operations.none)

    }

  },[operation])
  
  // it is called by input modal's cancel or confirm button,
  // action, accountNumber, balance params passed in.
  // it builds the payload, and set [action] state to trigger 
  // the useEffect() to call the updateExchangeAccounts() which
  // provided by UserProfileContext to work with backend API.
  function handleModalInput(action, accountNumber, balance, operation){
    //window.alert(action + accountNumber + balance)
    // console.log("action: ", action, "operation: ", operation, "balance: ", balance, "accNum: ", accountNumber)

    switch(action){
      
      case Actions.confirm: {    
        
        // trigger useEffect() to updateExchangeAccounts() with payload
        // either create an account or popup the given account
        if(operation === Operations.create){

          // set the payload for create operation
          setPayload({
            user: userId,
            accountId: null,
            account_number: accountNumber,
            value: parseFloat(balance)
          })
          setOperation(Operations.create)

        }else if (operation === Operations.popup) {

          // set the payload for popup operation
          setPayload({
            user: userId,
            accountId: accounts.filter(account => account.account_number === accountNumber)[0]._id,
            account_number: accountNumber,
            value: parseFloat(balance)
          })
          setOperation(Operations.popup)
        }
        break
      }

      case Actions.cancel:{
        setPayload({})
        setOperation(Operations.none)
        break
      }

      case Actions.close:{
        setPayload({})
        setOperation(Operations.none)
        break
      }

      default: break 
    }

    setModalSwitch(false)
    
  }

  // when user click the add account
  function handleAdd(e){
    e.preventDefault()
    // pass an empty string '' as the account number which pass to the input modal.
    setAccountNumberPassToPopup('')
 
    //calling out a modal and asking user to input accountId and 
    setModalSwitch(Operations.create)
  }

  function handlePopup(accountId){
    
    const accountNumber = getAccountNumberFromId(accountId)

    // initialize the account number field with the selected account number.
    setAccountNumberPassToPopup(accountNumber)
    // toggle on the input modal
    setModalSwitch(Operations.popup)

  }
  
  // call the removeExchangeAccount() function to remove
  function handleDelete(accountId){

    
    const account = accounts.filter(account => account._id === accountId)[0]
    const remainedTickers = account.tickers.length
    const remainedBalance = account.balance
    console.log('delete account: ', remainedTickers, remainedBalance)
    if(remainedTickers !== 0 || remainedBalance !== 0){
      window.alert('account still has tickers and balance, can not remove.')
      setOperation(Operations.none)
    
    } else {
    
      setPayload({
        user: userId, 
        accountId: accountId, 
        account_number: accounts.filter(account => account._id === accountId)[0].account_number,
        value: 0
      })
      setOperation(Operations.remove)
    }
  }


  function handleHistory(accountId){
    window.alert('history')
  }


  function handleGroupButtonsOnClick (e) {
    e.preventDefault()
    switch (e.target.name) {
      case 'delete': handleDelete(e.target.id); break
      case 'history': handleHistory(e.target.id); break
      case 'popup': handlePopup(e.target.id); break
      default: window.alert('nothing')
    }
  }


  function getAccountNumberFromId(accountId){
    return accounts.filter(account=> account._id === accountId)[0].account_number
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
        onClick={handleAdd}
      >
        Add Account
      </Button>
      <CreateAccountInputModal 
        show={modalSwitch} 
        operation={modalSwitch}
        initAccountId={accountNumberPassToPopup}
        handleModalInput={handleModalInput}
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