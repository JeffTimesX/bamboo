import React, { 
  useState, 
  useEffect, 
  useContext 
} from 'react';

import { 
  CloseButton,
  Container,
  Row, 
} from 'react-bootstrap'

import { UserProfileContext } from '../contexts'

import { 
  PortfolioAccountSection
} from '../components'

import {useAuth0} from '@auth0/auth0-react'
export default function Portfolio() {

  const {
    userProfile,
    isProfileLoading,
    isProfileLoaded,
    populatePortfolioWithPriceAndValue 
  } = useContext(UserProfileContext)

  const [isTimerOn, setIsTimerOn] = useState(false)
  const [populatedPortfolios, setPopulatedPortfolios] = useState([])

  const {isAuthenticated} = useAuth0()

  console.log('App() checking isAuthorized: ', isAuthenticated)
  console.log('App() checking isProfileLoading: ', isProfileLoading)
  console.log('App() checking isProfileLoaded: ', isProfileLoaded)

  // populate price and value of each ticker for the given portfolio.
  async function populatePortfolios(){
  const promises = userProfile.exchangeAccounts.map(account=>{
      return new Promise(async (resolve, reject) => {
        const result = await populatePortfolioWithPriceAndValue(account.tickers)
        if(result){
          resolve({ 
            accountId: account._id,
            portfolio: result
          })
        } else {
          reject({error: 'populating portfolio failed'})
        } 
      })
    })
    const populated = await Promise.all(promises)

    console.log('Portfolio().populatePortfolios() received: ', populated)

    setPopulatedPortfolios(populated) 
    setIsTimerOn(true)
  }

  // fill up the portfolio of each exchange account while component is mounted.
  useEffect(() => {
      populatePortfolios()
  },[])

  // update the portfolios every 3 seconds.
  useEffect(() => {
      const timer = setInterval(populatePortfolios,3000)  
      //clear the interval while exit.
      return ()=> { clearInterval(timer) }     
},[isTimerOn])


  function calculateTotalValue(portfolio) {
    let totalValue = 0
    portfolio.forEach(ticker => totalValue += ticker.value)
    return totalValue
  }

  function getAccountNumberFromId(accountId){
    return userProfile.exchangeAccounts.filter(account => account._id === accountId)[0].account_number
  }
  
  return (
    <Container>
      <Row className="ps-2" > {/* close button */}
        <CloseButton variant="white" className="mt-2" onClick={ (e) => { window.alert("I am still not work.")}}/>
      </Row>
      <Row>
        <h1>Portfolio</h1>
      </Row>
      <hr />
      { populatedPortfolios[0] && populatedPortfolios.map( p => (
        <Row key={p.accountId}>
          <PortfolioAccountSection 
            accountNumber={ getAccountNumberFromId(p.accountId) }
            totalTickers={ p.portfolio.length }
            totalValue={calculateTotalValue(p.portfolio)}
            portfolio={ p.portfolio }
          />
        </Row>
        )
      )}
    </Container>
  )
}
