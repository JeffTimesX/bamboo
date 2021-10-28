import { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  Container, 
  Row, 
  Col, 
  CloseButton, 
  Button, 
} from 'react-bootstrap'


// receives the symbol of the ticker
// fetch ticker 5min, 15min, 30min, 60min, daily interval data from stock-api
// passes data to the TickerChart and the TickerBanner components and renders.
export default function TickerDetail ({tickerSymbol}) {

  const interval = {
    fiveMinutes: '5min',
    fifteenMinutes: '15min',
    thirtyMinutes: '30min',
    oneHour: '60min',
    daily: 'daily'
  }

  const stockApiUrl = process.env.REACT_APP_STOCK_API_URL
  let aggregatesPaths = {}
  Object.keys(interval).map(int => {
      return ({
        [int]: stockApiUrl + '/aggregate/' + tickerSymbol + '/' + interval[int] 
      })
    }).forEach(path =>{
      aggregatesPaths =
        {
          ...aggregatesPaths,
          ...path
        }
    })
  const [ticker, setTicker] = useState(tickerSymbol) 
  const [aggregates, setAggregates] = useState({})

  

  useEffect(()=>{ 
    async function getAggregates(){
      const getAggregatePromises = Object.keys(aggregatesPaths).map(key =>{
        return axios.get(aggregatesPaths[key])
      })
      //console.log(getAggregatePromises)
      const results =  await Promise.all(getAggregatePromises)
      let obj = {}
      results.forEach(result =>{
        console.log(result.data.interval)
        obj = {
          ...obj,
          [result.data.interval]:result.data.aggregate
        }
      })
      setAggregates(obj)
      console.log(aggregates)
    }
    getAggregates()
  },[])
    
  return (  
    <Container>
      <Row className="ps-2">
        <CloseButton variant="white" className="mt-2" onClick={ (e) => { window.alert('close detail')}}/>
      </Row>
      <Row className="p-2 justify-content-center">
        <Col xs='auto' >
          <h3>To be replaced with Ticker Title </h3>
        </Col>
      </Row>
      <Row className="p-2 justify-content-center ">
        <Col lg={4}>
          <p>this placeholder will be replaced with TickerDetailChart</p>
        </Col>
      </Row>
      <Row className="p-2 justify-content-center">
        <Col md={4}>
          <p>Open:</p>
        </Col>
        <Col md={4}>
          <p>High:</p>
        </Col>
        <Col md={4}>
        <p>Inventory:</p>
        </Col>
        <Col md={4}>
        <p>Close:</p>
        </Col>
        <Col md={4}>
        <p>Low:</p>
        </Col>
        <Col md={4}>
        <p>Value:</p>
        </Col>
      </Row>
      <Row className="p-2 justify-content-center">
        <Col md={4}>
          <Button className="btn btn-success" >Watch</Button>
        </Col>
        <Col md={4}>
          <Button className="btn btn-success" >Sell</Button>
        </Col>
        <Col md={4}>
          <Button className="btn btn-success" >Buy</Button>
        </Col>
      </Row>
    </Container>
  )
}