import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
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
  Loading,
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

// hollowcandlestick always breaks up itself when user manipulate 
// the zooming gauge or selector buttons.
// require('highcharts/modules/hollowcandlestick')(Highcharts)



// TickerDetail component receives the symbol of the ticker
// fetch ticker 5min, 15min, 30min, 60min, daily interval data from stock-api
// when the corresponding button is clicked.
// and persists these data for rotating within the page.
// it initializes the StockChart with the daily interval ts set, and response the 
// button click event to change the data  which serving the StockChart.
// passes data to the TickerChart and the TickerBanner components and renders.
export default function TickerDetail ({tickerSymbol}) {

  

  // console.log("userProfile context in ticker detail: ", userProfile)

  const aggregateIntervals = { 
    fiveMinutes: '5min',
    fifteenMinutes: '15min',
    thirtyMinutes: '30min',
    hourly: '60min',
    daily: 'daily'
  }

  const stockApiUrl = process.env.REACT_APP_STOCK_API_URL

  // get authentication.
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()
  
  // get context and init local state
  const { 
    isProfileLoading, 
    userProfile, 
    addToWatches, 
    addToPortfolio 
  } = useContext(UserProfileContext)

  const [selectedInterval, setSelectedInterval] = useState(aggregateIntervals['daily']) 
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

console.log('isAuthenticated in TickerDetail(): ', isAuthenticated)
console.log('user profile context in TickerDetail(): ', userProfile)


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
    console.log('updateStockChartOptions: ', plotOptions)
    setStockOptions(plotOptions)
  }

  async function getAggregate( symbol, interval ){
    const getAggregatePath = stockApiUrl + '/aggregate/' + symbol + '/' + interval
    // to check the path.
    console.log("getAggregatePath: ", getAggregatePath)
    const response = await axios.get(getAggregatePath)
    const data = await response.data
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
    updateStockChartOptions(symbol, formattedTs)
  }

  // response to the changes come from the search input.
  useEffect(() => {
    getAggregate(tickerSymbol, aggregateIntervals['daily'] )
  },[tickerSymbol])


  // response to the changes come from the interval button selection.
  useEffect(()=>{ 
    getAggregate(tickerSymbol, aggregateIntervals[selectedInterval])
  },[selectedInterval])


  function handleIntervalButtonOnClick( event ){
    event.preventDefault()   
    setSelectedInterval(event.target.name)
  }

  function handleWatchButtonOnClick(event){
    event.preventDefault()
    addToWatches(tickerSymbol)
  }

  function handleBuyButtonOnClick(event){
    addToPortfolio(tickerSymbol, 100)
  }

  return isProfileLoading ? (
    <Loading />
    ):(  
    <Container className="vh-100">
      <Row className="ps-2">
        <CloseButton variant="white" className="mt-2" onClick={ (e) => { window.alert('close detail')}}/>
      </Row>
      <hr />
      <Row className="p-2 justify-content-center ">
        <Col sm={12} >
            {/* <LineChart />  */}
            <StockChart options={stockOptions} highcharts={Highcharts} />
        </Col>
      </Row>
      <Row className="p-2 justify-content-center mb-1">
        <Col sm={8} md={3} lg={2}>
          <Button 
            variant="outline-light" 
            style={{width:"10rem"}} 
            name='fiveMinutes'
            onClick={handleIntervalButtonOnClick}
          >
            5 Minutes
          </Button>
        </Col>
        <Col sm={8} md={3} lg={2}>
          <Button 
            variant="outline-light" 
            style={{width:"10rem"}}
            name='fifteenMinutes'
            onClick={handleIntervalButtonOnClick}
          >
            15 Minutes
          </Button>
        </Col>
        <Col sm={8} md={3} lg={2}>
          <Button 
            variant="outline-light" 
            style={{width:"10rem"}}
            name='thirtyMinutes'
            onClick={handleIntervalButtonOnClick}
          >
            30 Minutes
          </Button>
        </Col>
        <Col sm={8} md={3} lg={2}>
          <Button 
            variant="outline-light" 
            style={{width:"10rem"}}
            name='hourly'
            onClick={handleIntervalButtonOnClick}
          >
            Hourly
          </Button>
        </Col>
        <Col sm={8} md={3} lg={2}>
          <Button 
            variant="outline-light" 
            style={{width:"10rem"}}
            name='daily'
            onClick={handleIntervalButtonOnClick}
          >
            Daily
          </Button>
        </Col >
      </Row>
      <hr />
      {isAuthenticated && (
              <Row className="p-2 justify-content-center">
              <Col md={3}>
                <Button 
                  variant="outline-warning" 
                  style={{width:"200px"}}  
                  onClick={handleWatchButtonOnClick}
                >
                  Watch
                </Button>
              </Col>
              <Col md={3}>
                <Button 
                  variant="outline-warning" 
                  style={{width:"200px"}} 
                  onClick={handleBuyButtonOnClick}
                >
                  Buy
                </Button>
              </Col>
              <Col md={3}>
                <Button 
                  variant="outline-warning" 
                  style={{width:"200px"}}
                  onClick={()=>window.alert('under construction.')}
                >
                  Sell
                </Button>
              </Col>
            </Row>
      )}
    </Container>
  )
}