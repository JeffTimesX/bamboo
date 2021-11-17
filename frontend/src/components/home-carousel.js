import { Carousel } from 'react-bootstrap';
import { useState, useEffect } from 'react';

import { useHistory } from 'react-router-dom'

import { DateTime } from 'luxon'
import axios from 'axios'
import Highcharts from 'highcharts/highstock'
import { StockChart } from '../components'

// Load Highcharts modules
require('highcharts/indicators/indicators')(Highcharts)
require('highcharts/indicators/pivot-points')(Highcharts)
require('highcharts/indicators/macd')(Highcharts)
require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/map')(Highcharts)


export default function IndexCarousel({ inputTickers }) {
  
  const [chartOptions, setChartOptions] = useState([])

  const history = useHistory()
  
  const stockApiUrl = process.env.REACT_APP_STOCK_API_URL
  
  const stockOptionsTemplate={
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
  }


// always initializing the first chart with daily interval ts.
function setStockOptions(symbol, ts) {
  const plotOptions= {
    ...stockOptionsTemplate,
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
  return plotOptions
}

async function ChartOptionWithAggregate ( symbol, interval ){
  const getAggregatePath = stockApiUrl + '/aggregate/' + symbol + '/' + interval
  const response = await axios.get(getAggregatePath)
  const data = response.data
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
  return setStockOptions(symbol, formattedTs)
}

  useEffect(()=>{
    async function readyCarouselChartOptions(){
      const resultPromises = inputTickers.map(ticker => {
        return new Promise((resolve, reject) =>{
          resolve(ChartOptionWithAggregate(ticker, 'daily'))
        })
      })
      const results = await Promise.all(resultPromises)
      setChartOptions(results)

    }
    readyCarouselChartOptions()

    return ()=>{setChartOptions({})}
    
  },[])


  return (
    <>
      <Carousel variant="dark"  >
        <Carousel.Item className='p-1'>
          <StockChart options={chartOptions[0]} highcharts={Highcharts}/> 
          <Carousel.Caption onClick={() => history.push(`/ticker-detail/${inputTickers[0]}`)}>
            <h4>{inputTickers[0]}</h4>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item className='p-1'>
          <StockChart options={chartOptions[1]} highcharts={Highcharts}/>
          <Carousel.Caption onClick={() => history.push(`/ticker-detail/${inputTickers[1]}`)}>
            <h4>{inputTickers[1]}</h4>
            
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item className='p-1'>
          <StockChart options={chartOptions[2]} highcharts={Highcharts}/>
          <Carousel.Caption onClick={() => history.push(`/ticker-detail/${inputTickers[2]}`)}>
            <h4>{inputTickers[2]}</h4>
            
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </>
  )

}