import React, { 
  useState, 
  useEffect,
  useContext 
} from 'react'

import { UserProfileContext } from '../contexts'

import { 
  Container,
  Table, 
  Row, 
  Col, 
  Button 
} from 'react-bootstrap'

import { 
  AccountActionsButtonGroup,
  CreateAccountInputModal,
} from '../components'


export default function ProfileExchangeAccountsWithStripe({ userId, accounts }) {

  // get updateExchangeAccount() from Context, use it to update the exchange 
  // account list in the UserProfileContext
  const { 
    updateExchangeAccounts,
    checkoutWithStripe,
  } = useContext(UserProfileContext)

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
      
    } else {
      window.alert(updatedExchangeAccounts.error)
    } 
  }
  
  
useEffect(()=>{

  // put all the following into an async function

  async function updateExchangeAccountsWithStripe(){
    if(operation){

      // console.log('check payload: ', payload)
  
      const {
        // user, 
        accountId,
        account_number,
        value
      } = payload


      // remove operation
      if(operation === Operations.remove){
        updateExchangeAccounts(operation, payload, afterUpdateCallback)
        setOperation(Operations.none)
        return
      }

      /**
       *  * possible create account and popup conditions:
       * c1. receive a request to create a new exchange account with 0 init balance
       * c2. a create request with inti balance
       * c3. a popup request with balance
       * c4. a popup request with 0 balance
       * 
       * if c1, create account to backend but without calling stripe api. then
       * if c4, return without any action.
       * if c3, pass the payload to /payment/checkout endpoint.
       * if c2, create a new exchange account with the given accountNumber
       * and zero balance, then fill up all the information to the payload
       * and pass the payload to payment/checkout endpoint to popup account.
       */

      if (accountId && value === 0){ // c4
        window.alert('woops, popup 0 balance to account.')
        setOperation(Operations.none)
        return
      
      } else if (!accountId && value ===0) { // c1
        
        updateExchangeAccounts(operation, payload, afterUpdateCallback)
        setOperation(Operations.none)
        return
      
      } else if (accountId && value > 0) { // c3
        
        const payloadWithCurrency = {
          ...payload,
          currency: 'USD'
        }
        // call the /payment/checkout endpoint with payload.
        // the endpoint should receive the turn back from stripe
        // and update the exchange account, then redirect the 
        // user agent to the /payment/returned/:status path.
        // the /payment/returned/:status pass shows up the result
        // and redirect user agent to /profile path.
        checkoutWithStripe(payloadWithCurrency)
        setOperation(Operations.none)
        return

      } else if (!accountId && value > 0) { // c2
  
        // call updateExchangeAccounts first with zero value
        // then in the callback send request to the /payment/checkout
        // endpoint. 
        
        // set zero value payload
        const zeroValuePayload = {
          ...payload,
          value: 0
        }
  
        console.log('zeroValuePayload: ', zeroValuePayload)
        
        updateExchangeAccounts(operation, zeroValuePayload, function (updatedExchangeAccounts){
          if(updateExchangeAccounts.error){
            window.alert(updateExchangeAccounts.error)
            setOperation(Operations.none)
            return
          } else {
  
            console.log('updatedExchangeAccounts after creating zeroValuePayload: ', updatedExchangeAccounts)
  
            // get the accountId of the new account which created with the given account_number
            const createdAccountId = updatedExchangeAccounts.filter(account=>account.account_number === account_number)[0]._id
            
            // new payload
            const newPayloadWithCurrency = {
              ...payload,
              accountId: createdAccountId,
              currency: 'USD'
            }
  
            console.log('after create zero init balance new payload: ', newPayloadWithCurrency)
  
            // call the payment/checkout endpoint with new payload
            checkoutWithStripe(newPayloadWithCurrency)  
            setOperation(Operations.none)
            return
          }
        })
      }
    }
  }

  updateExchangeAccountsWithStripe()

  return ()=> {
    setPayload({})
  }

},[operation])

  
  // it is called by input modal's cancel or confirm button,
  // action, accountNumber, balance params passed in.
  // it builds the payload, and set [action] state to trigger 
  // the useEffect() to call the updateExchangeAccounts() which
  // provided by UserProfileContext to work with backend API.
  function handleModalInput(action, accountNumber, balance, operation){

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

    // console.log('delete account: ', remainedTickers, remainedBalance)

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
  <Container>
    <Row sm={2}className="p-2 justify-content-center">
      <Col className="d-flex justify-content-start">
        <h3>Exchange Accounts</h3>
      </Col>
      <Col className="d-flex justify-content-end">
        <Button 
          variant="outline-success"
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
    </Row>
    <Row className="d-flex justify-content-start ps-3 pe-3 pt-2">
        <Table striped bordered hover variant='light'>
          <thead>
            <tr key='exchange-account-table-head'>
              <th >#</th>
              <th >Account Number</th>
              <th >Balance</th>
              <th style={{textAlign:"center"}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              accounts && accounts.map((account, index) => {
                return (
                  <tr key={account._id}>
                    <td style={{width: '5rem'}}>{index +1}</td>
                    <td style={{width: '15rem'}}>{account.account_number}</td>
                    <td style={{width: '15rem'}}>{account.balance}</td>
                    <td 
                      className="d-flex justify-content-center"
                    >
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
  </Container>
  

)
}