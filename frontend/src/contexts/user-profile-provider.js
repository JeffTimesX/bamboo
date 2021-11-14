import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useAuth0} from '@auth0/auth0-react';
import { UserProfileContext } from '../contexts';
import { DateTime } from 'luxon'


export default function UserProfileProvider({ backendUrl, stockApiUrl, postApiUrl, children }) {

  // authProfile could be undefined if the user is not logged in.
  const { 
    user:authProfile, 
    isAuthenticated, 
    getAccessTokenSilently 
  } = useAuth0()
  


  // const UserEndPoint
  const userEndPoint = backendUrl + '/user/user/'
  // createAccountEndpoint  
  const createExchangeAccountEndpoint = backendUrl + '/exchange/create/' 
  // update balance endpoint
  const popupExchangeAccountEndpoint = backendUrl + '/exchange/balance/' 
  // remove account endpoint
  const removeExchangeAccountEndpoint = backendUrl + '/exchange/remove/'
  // query ticker's current price
  const tickerCurrentPriceEndpoint = stockApiUrl + '/ticker/current/'
  // dealTicker endpoint
  const dealTickerEndPoint = backendUrl + '/exchange/deal/'  
  // watches endpoint
  const watchesEndpoint = backendUrl + '/user/watches/'
  // aggregate Endpoint
  const aggregateEndpoint = stockApiUrl + '/aggregate/'


  // user profile state will be enclosed in the context.
  const [userProfile, setUserProfile] = useState({})

  // indicator to postpone the renders of components to wait the profile loading.
  const [isProfileLoading, setIsProfileLoading] = useState(false)
  const [isProfileLoaded, setIsProfileLoaded] = useState(false)


// loading the user profile 
useEffect(() => {
  
  async function initUserProfile() {
    
    // console.log('UserProfileProvider().initUserProfile() checking authProfile in useEffect() before calling updateUserProfile(): ', authProfile)
    // console.log('UserProfileProvider().initUserProfile() checking userProfiler state before calling updateUserProfile(): ', userProfile)
    
    const result = await updateUserProfile({profile:{auth:authProfile}})
    
    // console.log('UserProfileProvider().initUserProfile() received returned user profiler from updateUserProfile(): ', result)
    // console.log('UserProfileProvider().initUserProfile() checking userProfiler state immediately after called updateUserProfile():', userProfile)
    
    setIsProfileLoading(false)
    setIsProfileLoaded(true)
  }

  // console.log('UserProfileProvider().useEffect() checking isAuthenticated: ', isAuthenticated)
  // console.log('UserProfileProvider().useEffect() checking isProfileLoading: ', isProfileLoading)
  // console.log('UserProfileProvider().useEffect() checking isProfileLaded: ', isProfileLoaded)

  if(isAuthenticated){

    setIsProfileLoading(true)

    setUserProfile({profile: {auth:authProfile}})

    // console.log('userProfileProvider().useEffect() calling initUserProfile()')

    initUserProfile()

    // console.log('after userProfileProvider().useEffect().init() called checking isAuthenticated: ',isAuthenticated)
    // console.log('after userProfileProvider().useEffect().init() called checking isProfileLoading: ',isProfileLoading)
    // console.log('after userProfileProvider().useEffect().init() called checking isProfileLoaded: ',isProfileLoaded)
  }
    
},[isAuthenticated])


  // call GET /user/user/:sub to get the user profile.
  async function getUserProfile( userId ) {

    if(!userId) return ({error:'userId is not provided.'})
    const response = await axios.get(userEndPoint + userId)
    const updatedUserProfile = response.data
    return updatedUserProfile
  }

// receives an user profile, sends it to the backend server to update
// corresponding document and returns the full updated profile document.
async function updateUserProfile(user){

  // console.log('updateUserProfile received input UserProfile: ', user)

  if(!isAuthenticated || 
    !user || 
    !user.profile || 
    !user.profile.auth || 
    !user.profile.auth.sub ) {
    // console.log("UserProfileProvider().updateUserProfile() reports error: user does not login, nothing to update.")
    return
  }
  const token = await getAccessTokenSilently()

  // GET user/user/:sub 
  const firstCheck = await axios.get(
    userEndPoint + user.profile.auth.sub, 
    user,
    { headers: { Authorization: `Bearer ${token}` }}
  )
  let checked = firstCheck.data

  console.log('UserProfileProvider().updateUserProfile() first check: ', checked)
  
  // when error: user not found shows up in the response, 
  // it means that this is the first time user signed up
  // there is not any information associated with this 
  // user in the backend server, create it with the auth
  // plus a framework of ext.
  if(checked.error) {
    checked = {
      ...user,
      profile:{
        ...user.profile,
        ext: {
          first_name: '',
          last_name: '',
          gender: '',
          date_of_birth: '2000-01-01',
          occupation: ''
        }
      }
    }
  } else if (user.profile.ext) { 
    // else if the checked returned a user profile, that means
    // the user profile exists in the backend server. 
    // if ext part is found from the given user.profile
    // means the profile need to be updated with the given ext part.
    checked = user
  } 
  // the left condition that uer.profile come without .ext part
  // means the signed up user log in the app, pass the checked
  // profile back to the backend server to update without any change. 

  // POST /user/user/:sub
  const response = await axios.post(
    userEndPoint + checked.profile.auth.sub, 
    checked,
    { headers: { Authorization: `Bearer ${token}` }}
  )
  const updated = await response.data
  setUserProfile(updated) 
  console.log("UserProfileProvider().updateUserProfile(): update profile successfully ", updated)

  return updated
}

// add a ticker to the watches[]
async function addToWatches(ticker){    
  if ( userProfile.watches.filter((watched) => watched.ticker === ticker)[0]) return
  const updateWatches = [...userProfile.watches]
  updateWatches.push({ticker: ticker, watched_at:DateTime.now().toISO()})
  const token = await getAccessTokenSilently()
  const response = await axios
    .post(
      watchesEndpoint + userProfile.profile.auth.sub, 
      { watches: updateWatches }, 
      { headers: { Authorization: `Bearer ${token}` } }
    )
  const updatedWatches = response.data
  setUserProfile({
    ...userProfile,
    watches: updatedWatches
  })
}

// remove a ticker from the watches[]
async function removeFromWatches(ticker){ 
  if( !userProfile.watches.filter((watched) => watched.ticker === ticker)[0]) return
  const updateWatches = userProfile.watches.filter((watched) => watched.ticker !== ticker)
  const token = await getAccessTokenSilently() 
  const response = await axios
    .post(
      watchesEndpoint + userProfile.profile.auth.sub, 
      { watches: updateWatches }, 
      { headers: { Authorization: `Bearer ${token}` } }
    )
  const updatedWatches = response.data
  setUserProfile({
    ...userProfile,
    watches: updatedWatches
  })
}

// call exchange/create/userId create an exchange account to the userId 
// with the given account payload, return updated userProfile or error message.
async function createExchangeAccount( userId, account ){
  if(!account || 
    !account.account_number || 
    !account.user ||
    account.user !== userId){
    return ({error:'mismatched inputs.'})
  } else {

    const token = await getAccessTokenSilently()

    try {
      
      console.log("UserProfileProvider().createExchangeAccount() will create account: ", account)
      
      const response = await axios.post(
        createExchangeAccountEndpoint + userId,
        account,
        { headers: { Authorization: `Bearer ${token}` }}
      ) 
      const updatedUserProfile = await response.data
      
      console.log("UserProfileProvider().createExchangeAccount() received updated profile: ", updatedUserProfile)
      
      return updatedUserProfile

    } catch (err) {

      console.log("UserProfileProvider().createExchangeAccount() received error: ", err.message)
      
      return ({error: 'creating account at backend failure.'})
    }
    
  }
}

// call exchange/remove/accountId to remove the exchange account from the userId.
async function removeExchangeAccount(userId, account) {
  if(!userId || 
    !account || 
    !account.accountId){
      return ({error:'mismatched inputs.'})
  } else {
    const token = await getAccessTokenSilently()
    try {
      const response = await axios.delete(
        removeExchangeAccountEndpoint + account.accountId,
        { headers: { Authorization: `Bearer ${token}` }}
      )
      return await response.data.user
    } catch (err) {
      return {error: 'removing account at backend failure.'}
    }
  }
}

// call exchange/balance/accountId to update account balance.
async function popupExchangeAccount(userId, account) {
  if(!userId || 
    !account || 
    !account.accountId){
      return ({error:'mismatched inputs.'})
  } else {
    const token = await getAccessTokenSilently()
    
    console.log("UserProfileProvider().popupExchangeAccount() will popup account: ", account)
    
    try {
      const response = await axios.post(
        popupExchangeAccountEndpoint + account.accountId,
        account,
        { headers: { Authorization: `Bearer ${token}` }}
      )
      console.log("UserProfileProvider().popupExchangeAccount() received: ", response.data)
      return await response.data 
    } catch (err) {
      console.log("UserProfileProvider().popupExchangeAccount() received error: ", err.message)
      return {error: 'popup account at backend failure.'}
    }
  }
}

// buy or sell the given amount of a ticker with the specific price,
// charge or popup the total value from the accountId. 
// 
async function dealTickerAndUpdateUserProfile(transaction){

  function checkBalance(accountId, charge) {
    const chargeAccount = userProfile.exchangeAccounts.filter(account => account._id === accountId)[0]
    return chargeAccount.balance >= charge ? true : false
  }

  function checkInventory(accountId, ticker, amount) {
    const chargeAccount = userProfile.exchangeAccounts.filter(account => account._id === accountId)[0]
    const inventory = chargeAccount.tickers.filter(t => t.ticker === ticker)[0]
    return inventory.amount >= amount ? true : false
  }
    
  const { 
    accountId,
    ticker,
    price,
    amount,
    type, 
  } = transaction
  
  if( !accountId || !ticker ||
    !price || !amount || !type ){
      // console.log('UserProfileProvider().dealTicker() report error: params are missing.')
      return ({error: 'dealTicker() report error: parameters are missing'})
  } else if( type ==='buy' && !checkBalance(accountId, parseInt(amount)*parseFloat(price))){

    // console.log(`UserProfileProvider().dealTicker() report error: the balance  of accountId ${accountId} is not enough to pay the transaction.`)
    return ({error: 'insufficient balance'})

  } else if(type === 'sell' && !checkInventory(accountId, ticker, amount)){
    
    // console.log(`UserProfileProvider().dealTicker() report error: the inventory  of ${ticker} is not enough to sell.`)
    return ({error: 'insufficient inventory'})
  
  } else {
    
    const token = await getAccessTokenSilently()
    
    const response = await axios.post(
      dealTickerEndPoint + accountId,
      transaction,
      { headers: { Authorization: `Bearer ${token}` }}
    )
    
    const updatedExchangeAccount = response.data
    
    if(updatedExchangeAccount.error) {
      // console.log("UserProfileProvider().dealTicker() report error: ", updatedExchangeAccount.error)
      return {error: 'deal ticker failed, update exchange account failed.'}
    }
    
    // console.log('UserProfileProvider().dealTicker() received updated Exchange Account: ', updatedExchangeAccount)
    
    // get the related user id 
    const userId = updatedExchangeAccount.user
    
    // get a full user profile with the userId then setUserProfile() with it.
    const updatedUserProfile = await getUserProfile(userId)

    if(updatedUserProfile.error) {
      // console.log('UserProfileProvider().dealTicker() received error: ', updatedUserProfile.error)
      return {error: 'deal ticker failed, update user profile failed.'}
    }

    // console.log("UserProfileProvider().dealTicker:() received updated User Profile: ", updatedUserProfile)

    // update the userProfile context
    setUserProfile(updatedUserProfile)
    
    return updatedUserProfile
  }

}

// update exchange account.
// payload: {user, accountId, account_number, value}
// when create: accountId should be null

async function updateExchangeAccounts(operation, payload, afterUpdateCallback ){
  
  // console.log('UserProfileProvider().updateExchangeAccounts() received action: ', operation)
  // console.log("UserProfileProvider().updateExchangeAccounts() received payload: ", payload)

  switch (operation){
    case 'create' : {
      // checking the account_number passed by the payload, if it does not provided
      // or it exists in the current exchangeAccounts[] of the userProfile context
      // returns the feedback with error error.
      if(!payload || !payload.account_number ) {
        
        // console.log('UserProfileProvider().updateExchangeAccounts() -create- report error: account_number does not provided.')
        afterUpdateCallback({error:'account_number does not provided.'})
        break

      } else if (userProfile.exchangeAccounts.filter(
        account => account.account_number === payload.account_number)[0]){
        
        // console.log('UserProfileProvider().updateExchangeAccounts() report error: account already exists.')
        afterUpdateCallback({error:'account already exists.'})
        break

      } else {
        // otherwise, axios.post() to send a request to the backend to create an account,
        // then setUserProfile() with the returned userProfile
        // then feedbacks an updated exchangeAccounts[] to the caller.

        // console.log('UserProfileProvider().updateExchangeAccounts() check payload: ', payload)
        
        const updatedUserProfile = await createExchangeAccount(userProfile._id, payload)
                
        // createExchangeAccount() returned an updated userProfile
        if(!updatedUserProfile.error){

          // console.log("UserProfileProvider().updateExchangeAccounts() -create- received updated user profile:  ", updatedUserProfile)

          setUserProfile(updatedUserProfile)
          afterUpdateCallback(updatedUserProfile.exchangeAccounts)
        } else {
          // or not.
          // console.log("UserProfileProvider().updateExchangeAccounts() -create- received updated failure: ", updatedUserProfile)

          afterUpdateCallback({error:'create account failure.'})
        }
      }
      break
    }
    case 'remove' : {
      if(!payload || !payload.accountId){

        // console.log('UserProfileProvider().updateExchangeAccounts() -remove- report error: accountId does not provided.')

        afterUpdateCallback({error:'accountId does not provided.'})
        break
      } else if(!userProfile.exchangeAccounts.filter(
        account => account._id === payload.accountId)[0]){
        
        // console.log('UserProfileProvider().updateExchangeAccounts() -remove- report error: account does not exist.')

        afterUpdateCallback({error:'account does not exist.'})
        break

      } else {
        const updatedUserProfile = await removeExchangeAccount(userProfile._id, payload)
        if(!updatedUserProfile.error){
          
          // console.log("UserProfileProvider().updateExchangeAccounts() -remove- received updated user profile: ", updatedUserProfile)

          setUserProfile(updatedUserProfile)
          afterUpdateCallback(updatedUserProfile.exchangeAccounts)
        } else {

          // console.log("UserProfileProvider().updateExchangeAccounts() -remove- received error:", updatedUserProfile)
          
          afterUpdateCallback({error:'remove account failure.'})
        }
      }
      break
    }
    case 'popup' : {
      if(!payload || 
        !payload.accountId || 
        !payload.value){

        // console.log('UserProfileProvider().updateExchangeAccounts() -popup- report error: accountId or amount does not provided.')

        afterUpdateCallback({error:'accountId or amount does not provided.'})
        break
      } else if(!userProfile.exchangeAccounts.filter(
        account => account._id === payload.accountId)[0]){
        
        // console.log('UserProfileProvider().updateExchangeAccounts() -popup- report error: account does not exist.')

        afterUpdateCallback({error:'account does not exist.'})
        break

      } else {
        const updatedAccount = await popupExchangeAccount(userProfile._id, payload)
        if(!updatedAccount.error){

          // console.log("UserProfileProvider().updateExchangeAccounts() -popup- received updated account : ", updatedAccount)

          const index = userProfile.exchangeAccounts.findIndex((account) => account._id === updatedAccount._id)

          const updatedAccounts = userProfile.exchangeAccounts
          updatedAccounts.splice(index, 1, updatedAccount)

          const updatedUserProfile = {
            ...userProfile,
            exchangeAccounts: updatedAccounts
          }
          // console.log("UserProfileProvider().updateExchangeAccounts() -popup- received updated User Profile: ", updatedUserProfile) 

          setUserProfile(updatedUserProfile)
          afterUpdateCallback(updatedUserProfile.exchangeAccounts)
        } else {

          // console.log("UserProfileProvider().updateExchangeAccounts() -popup- received updating account error: ", updatedAccount)

          afterUpdateCallback({error:'popup account failure.'})
        }
      }
      break
    }
    default: break; 
  } 
    
}

// get ticker current price
async function getTickerCurrentPrice(ticker){
  const token = await getAccessTokenSilently()
  const response = await axios.get(
    tickerCurrentPriceEndpoint + ticker,
    {headers: { Authorization: `Bearer ${token}` }}
  )
  return response.data  // { ticker: ticker, price: price } returned
}

// get current price of tickers for a specific portfolio
async function populatePortfolioWithPriceAndValue(portfolio){

  const token = await getAccessTokenSilently() 
  
  const promises = portfolio.map(ticker => {
    return axios.get(
      tickerCurrentPriceEndpoint + ticker.ticker,
      {headers: { Authorization: `Bearer ${token}` }}
      )
  })

  const responses = await Promise.all(promises)
  const portfolioWithPrice = responses.map(response => response.data)
  
  // console.log('UserProfileProvider().populatePortfolioWithPriceAndValue() received portfolio with price populated: ', portfolioWithPrice)
  
    const portfolioWithPriceAndValue = portfolio.map(ticker => {
      const filtered = portfolioWithPrice.filter(t => t.ticker === ticker.ticker)[0]
      return {
        ticker: ticker.ticker,
        inventory: ticker.amount,
        price: filtered.price,
        value: parseFloat(filtered.price) * parseInt(ticker.amount)
      }
    })
  
  // console.log('UserProfileProvider().populatePortfolioWithPriceAndValue() returns: ', portfolioWithPriceAndValue)

  return portfolioWithPriceAndValue
}

// get aggregate of a given ticker symbol and the interval.
async function getAggregateBySymbolAndInterval(symbol, interval) {
  
  const path = aggregateEndpoint + symbol + '/' + interval
  
  // const token = await getAccessTokenSilently()
  return axios.get(
    path,
  //  { headers: { Authorization: `Bearer ${token}` }}
    )
}

const contextValue = {
    userProfile,
    setUserProfile,

    isProfileLoading,
    isProfileLoaded,
    setIsProfileLoading,

    addToWatches,
    removeFromWatches,
    
    getUserProfile,
    updateUserProfile,

    updateExchangeAccounts,
    dealTickerAndUpdateUserProfile,

    populatePortfolioWithPriceAndValue,
    getTickerCurrentPrice,

    getAggregateBySymbolAndInterval,
  
  }


  return  (
    <UserProfileContext.Provider value={contextValue}>
      {children}
    </UserProfileContext.Provider>
  )
}