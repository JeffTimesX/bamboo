import { 
  useState, 
  useEffect, 
  useContext 
} from 'react'

import { DateTime } from 'luxon'

// Import Highcharts
import Highcharts from 'highcharts/highstock'

// import react-bootstrap
import { 
  Container, 
  Row, 
  Col, 
  CloseButton, 
  Button,
} from 'react-bootstrap'


// import customized chart
import {
  StockChart,
  DealInputModal,
} from '../components'

// import context
import { 
  UserProfileContext
} from '../contexts'

import { useAuth0 } from '@auth0/auth0-react'


// Load Highcharts modules
require('highcharts/indicators/indicators')(Highcharts)
require('highcharts/indicators/pivot-points')(Highcharts)
require('highcharts/indicators/macd')(Highcharts)
require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/map')(Highcharts)


// TickerDetail component receives the symbol of the ticker
// fetch ticker 5min, 15min, 30min, 60min, daily interval data from stock-api
// when the corresponding button is clicked.
export default function TickerDetail ({tickerSymbol}) {

  const aggregateIntervals = { 
    fiveMinutes: '5min',
    fifteenMinutes: '15min',
    thirtyMinutes: '30min',
    hourly: '60min',
    daily: 'daily'
  }


  // get authentication.
  const { isAuthenticated } = useAuth0()

  // get context and init local state
  const {  
    userProfile, 
    addToWatches, 
    dealTickerAndUpdateUserProfile,
    getTickerCurrentPrice,
    getAggregateBySymbolAndInterval
  } = useContext(UserProfileContext)

  const Actions = {
    buy: 'buy',
    sell: 'sell',
    none: null
  }

  const [selectedInterval, setSelectedInterval] = useState(aggregateIntervals['daily']) 
  const [show, setShow] = useState(false)
  const [action, setAction] = useState(Actions.none)
  const [currentPrice, setCurrentPrice] = useState(0)
  const [inventory, setInventory] = useState(0)
  const [actionPassToInputModal, setActionPassToInputModal] = useState('')
  const [contract, setContract] = useState({})

  // stock options for highcharts rendering.
  const [stockOptions, setStockOptions] = useState({
    title: {
      text: 'unknown'
    },
    chart: {
      //backgroundColor: ''
    },
    yAxis: [{
      height: '75%',
      labels: {
        align: 'right',
        x: -3
      },
      title: {
        text: 'Price'
      }
    }, {
      top: '75%',
      height: '25%',
      labels: {
        align: 'right',
        x: -3
      },
      offset: 0,
      title: {
        text: 'MACD'
      }
    }],
    series: [
      {
        data: [],   
      }
    ]
  })

  // always initializing the first chart with daily interval ts.
  function updateStockChartOptions(symbol, ts) {
    const plotOptions= {
      ...stockOptions,
      title: {
        text: symbol
      },
      series: [
        {
          data: [...ts.reverse()],
          type: 'candlestick',
          id: symbol,
          name: symbol + ' Price',   
        },{
          type: 'macd',
          yAxis: 1,
          linkedTo: symbol,
          name: symbol + ' MACD',
        }
      ]
    }
    
    // console.log('TickerDetail().updateStockChartOptions() returned: ', plotOptions)
    
    setStockOptions(plotOptions)
    
    return plotOptions
  }

  async function updateStockOptionsWithAggregate( symbol, interval ){
    
    
    const response = await getAggregateBySymbolAndInterval( symbol, interval)
    
    const data= await response.data
    
    const formattedTs = data.aggregate.ts.map( t => {
      return [
        DateTime.fromISO(t.timestamp).ts,
        parseFloat(t.open),
        parseFloat(t.high),
        parseFloat(t.low),
        parseFloat(t.close),
        parseFloat(t.volume),
      ]
    })
    return updateStockChartOptions(symbol, formattedTs)
  }

  // processDeal()
  async function processDeal( contract ){
    const { 
      accountId,
      ticker, 
      price,
      amount,
      type,
      } = contract

    if( !ticker || !price || !amount || !accountId || !type) {
      
      // console.log('TickerDetail().processDeal() report error: contract parameters are missing.')
      
      return ({error: 'contract parameters are missing.'})

    } else {

      const transaction = {
        ...contract,
        issue_at: DateTime.now().toISO(),
      } 

      // console.log('TickerDetail().processDeal() is processing: ', transaction )

      const result = await dealTickerAndUpdateUserProfile(transaction) 

      return result
    }
  }



  // initialization, response to the changes come from the search input.
  useEffect(() => {
    
    // init the StockChart with daily interval aggregates. 
    async function init ()  {

      console.log('TickerDetail().useEffect().init() calling updateStockOptionsWithAggregate() with: ', tickerSymbol)
      
      const options = await updateStockOptionsWithAggregate(tickerSymbol, aggregateIntervals['daily'] )
      
      console.log( 'TickerDetail().useEffect().init() received: ', options)
    }

    init()

  },[tickerSymbol])


  // response to the changes come from the interval button selection.
  useEffect(()=>{ 
    
    async function onIntervalChange() {

      console.log('TickerDetail().useEffect().onIntervalChange() calling updateStockOptionsWithAggregate() with: ', tickerSymbol, '/',aggregateIntervals[selectedInterval])
      const options = await updateStockOptionsWithAggregate(tickerSymbol, aggregateIntervals[selectedInterval])
    }

    onIntervalChange()

  },[selectedInterval])


  // processing buy or sell asynchronous action.
  useEffect(()=>{ 
    
    if(action !== Actions.none) {

      const result = processDeal(contract)

      console.log("TickerDetail().useEffect().processDeal() received: ", result)

      // insufficient balance
      if (result.error){
        switch (result.error){
          case 'insufficient balance': {
            window.alert('deal failed: insufficient balance of the charging account.')
            break
          }
          case 'insufficient inventory': {
            window.alert('deal failed: insufficient inventory of the charging account.')
            break
          }
          default: {
            window.alert('deal failed: something went wrong.')
            break
          }
        }
      
      } else {

        window.alert(`deal success:${contract.type} ${contract.amount} of ${contract.ticker} at ${contract.price}.`)
      
      }
  
      setAction(Actions.none)
  

    }
    
  },[action])


  function handleIntervalButtonOnClick( event ){
    event.preventDefault()   
    setSelectedInterval(event.target.name)
  }

  function handleWatchButtonOnClick(event){
    event.preventDefault()
    addToWatches(tickerSymbol)
  }

  // pass init data to inputModal through setting the states.
  // setting true to show the modal.
  async function handleDealsButtonOnClick( event ){   

    // action pass to InputModal, either buy or sell
    setActionPassToInputModal(event.target.name)

    // get current price of the ticker from backend and pass it to InputModal
    const { price } = await getTickerCurrentPrice(tickerSymbol)
    setCurrentPrice(price)   

    // calculate the total inventory of the ticker across all the accounts
    // then pass it to InputModal
    let totalInventory = 0
    userProfile.exchangeAccounts.forEach(account => {
      const checkedAccount = account.tickers.filter(t => t.ticker === tickerSymbol)[0]
      checkedAccount && ( totalInventory += checkedAccount.amount)
    })
    setInventory(totalInventory)
    setShow(true)
  }

  // handle the filled inputs returned from the InputModal
  // create the contract for following processing
  // setAction() to trigger the useEffect() to process
  // the contract with the backend server.
  function handleDealInput(action, filledInputs){

    // console.log("handleDealInput() received action:", action, filledInputs)

    const contract = { ...filledInputs, type: action } 
    const account = userProfile.exchangeAccounts.filter(account => account._id === contract.accountId)[0]
    const ticker = account && account.tickers.filter(t => t.ticker === contract.ticker)[0]
    
    switch(action){
      case 'buy': {
        // if the total value of the contract exceed the value of the balance of the accountId
        // alert() user to change the values.
        if(account && account.balance < parseFloat(contract.price) * parseInt(contract.amount)){
          window.alert('no enough balance to buy.')
        } else {
          
          // pass contract to useEffect() by the state
          setContract(contract)

          // trigger the useEffect() 
          setAction(Actions.buy)

          // toggle off the modal
          setShow(false)

        }
        break
      }
      case 'sell': {
        // if the inventory of current accountId is smaller than the amount
        // alert() user to change the values.

        // console.log('account, ticker, amount: ', account, ticker)
        
        if( ticker && ticker.amount >= contract.amount ){

          // pass contract to useEffect() by the state
          setContract(contract)

          // trigger the useEffect() 
          setAction(Actions.sell)

          // toggle off the modal
          setShow(false)

        } else {

          window.alert('no enough inventory to sell.')

        }
        break
      }
      default: {
        setShow(false)
        break
      }    
    }
  }


  return (  
    <Container style={{height: "90vh", overflow:"scroll"}}>
      <Row className="ps-2">
        <CloseButton variant="white" className="mt-2" onClick={ (e) => { window.alert('close detail')}}/>
      </Row>
      <hr />
      <Row 
        className="justify-content-center mb-2 mt-3 pt-2"
        style={{border: '1px solid', borderColor:"green"}}
      >
        <Row className="p-2 justify-content-center mb-3">
        <Col sm={12} >
            <StockChart options={stockOptions} highcharts={Highcharts} />
        </Col>
        </Row>
        <Row className="p-2 justify-content-center mb-3">
        <Col sm={8} md={3} lg={2}>
          <Button 
            variant="outline-dark" 
            style={{width:"10rem"}} 
            name='fiveMinutes'
            onClick={handleIntervalButtonOnClick}
          >
            5 Minutes
          </Button>
        </Col>
        <Col sm={8} md={3} lg={2}>
          <Button 
            variant="outline-dark" 
            style={{width:"10rem"}}
            name='fifteenMinutes'
            onClick={handleIntervalButtonOnClick}
          >
            15 Minutes
          </Button>
        </Col>
        <Col sm={8} md={3} lg={2}>
          <Button 
            variant="outline-dark" 
            style={{width:"10rem"}}
            name='thirtyMinutes'
            onClick={handleIntervalButtonOnClick}
          >
            30 Minutes
          </Button>
        </Col>
        <Col sm={8} md={3} lg={2}>
          <Button 
            variant="outline-dark" 
            style={{width:"10rem"}}
            name='hourly'
            onClick={handleIntervalButtonOnClick}
          >
            Hourly
          </Button>
        </Col>
        <Col sm={8} md={3} lg={2}>
          <Button 
            variant="outline-dark" 
            style={{width:"10rem"}}
            name='daily'
            onClick={handleIntervalButtonOnClick}
          >
            Daily
          </Button>
        </Col >
        </Row>
      </Row>
      
      <hr />
      {isAuthenticated && (
        <Row className="p-2 justify-content-center">
          <Col md={3}>
            <Button 
              variant="outline-primary" 
              style={{width:"200px"}}  
              onClick={handleWatchButtonOnClick}
            >
              Watch
            </Button>
          </Col>
          <Col md={3}>
            <Button 
              variant="outline-primary" 
              name='buy'
              style={{width:"200px"}} 
              onClick={handleDealsButtonOnClick}
            >
              Buy
            </Button>
          </Col>
          <Col md={3}>
            <Button 
              variant="outline-primary" 
              name='sell'
              style={{width:"200px"}}
              onClick={handleDealsButtonOnClick}
            >
              Sell
            </Button>
          </Col>
          <DealInputModal 
            show={show}
            tickerSymbol={tickerSymbol}
            action={actionPassToInputModal}
            initPrice={currentPrice}
            initAmount={inventory}
            initAccounts={userProfile.exchangeAccounts}
            handleDealInput={handleDealInput}
          />
        </Row>    
      )}
    </Container>
  )
}