// ticker-controller
const async = require('async')
const { DateTime } = require('luxon')
const axios = require('axios')

const Ticker = require('../models/ticker')
const { response } = require('express')
const { token } = require('morgan')

// config for tickers source.
const tickersEndpoint = process.env.POLYGON_TICKERS
const apiKey = process.env.POLYGON_API_KEY

/**
 * searchTickers() returns an array of tickers which each of 
 * the ticker match the key/value pairs sent in the query string.
 */
 const searchTickers = function (req, res, next) {
  let filter ={}
  const query = req.query
  if(query){
    const queryArray = Object
      .keys(query)
      .map( key => ( { [ key ]: { "$regex": query[ key ], "$options": "i" } } ) )
    queryArray.forEach(value => {
      filter = { ...value, ...filter }
    })
  } else {
    return next(new Error('query string required'))
  }
  
  Ticker
    .find(filter)
    .exec(function (err,tickers) {
      if(err) return next(err)
      return res.json(tickers)
    })
}

/**
 * getTickerById() returns the exact ticker which the _id 
 * matches he given searching id.
 */
 const getTickerById = function (req, res, next) {
  const _id = req.params.id
  Ticker
    .find({ "_id": _id })
    .exec(function (err, ticker) {
      if(err) return next(err)
      return res.json(ticker)
    })
}
/**
 * getTickerBySymbol() returns the profile of the ticker 
 * exactly matches the given searching symbol, case-insensitive.
 */
  const getTickerBySymbol = function (req, res, next) {
  const ticker = req.params.symbol
  const re = new RegExp( `^${ticker}$`, 'i')
  Ticker
    .find({ 
      "ticker": {"$in": re }
    })
    .exec(function (err, tickers) {
      if(err) return next(err)
      return res.json(tickers)
    })
}
/**
 * getTickersByName returns an array of tickers which the name of each
 * ticker contains the given searching name.
 */
const getTickersByName = async function (req, res, next) {
  const name = req.params.name
  Ticker
    .find({ 
      "name": {"$regex": name, "$options": "i"} 
    })
    .exec(function (err, tickers) {
      if(err) return next(err)
      return res.json(tickers)
    })
}

/**
 * initTickers() fetch all available tickers metadata from polygon.io
 * through the tickersEndpoints. have to craft a schedule tasks to fetch
 * all the tickers due to the 5 calls per minute limitation of the site.
 */
const initTickers = async function (req, res, next) {

  const cursorBase = `${tickersEndpoint}${apiKey}`
  let totalCount = 0
  let cursor = cursorBase

  function getTickersWithDelay(delaySeconds) {
    return new Promise(function (resolve, reject) {
      setTimeout(function ( ) {
        axios
          .get(cursor)
          .then(function (response) {
            if(response.data.status && response.data.status === 'OK'){
              resolve(response.data)
            } else {
              resolve([])
            }
          })
          .catch(function (err){
            next(err)
          })
        },
        delaySeconds
      )
    })
  }
  console.log("original cursor: ", cursor)
  do{
    // let data = await getTickersWithDelay(2000)
    let { 
      results: tickers,
      status: status,
      count: count,
      next_url: nextUrl
    } = await getTickersWithDelay(15010);

    if(status && status === 'OK'){
      Ticker
        .bulkWrite(
          tickers.map( ticker => (
            { updateOne: {
                filter: { ticker: ticker.ticker },
                update: ticker,
                upsert: true
              }
            }
          ))
        )
        .then(function(bulkSaveResult){
          console.log('bulk write result: ', bulkSaveResult)
          // res.json(bulkSaveResult)
          totalCount += bulkSaveResult.nUpserted
        })
        .catch(function(err){
          console.log('bulk save error: ', err.message)
          return next(err)
        })       
    } 
    console.log("next url: ", nextUrl)
    nextUrl 
      ? cursor = nextUrl + '&' + apiKey 
      : cursor = null
    console.log("updated cursor: ", cursor)
  }while(cursor)
  
  res.json({ 
    status: 'success',
    totalUpdatedTickers: totalCount 
  })
  
}

const testRoute = function (req, res, next) {
  console.log('req.url: ', req.url)
  console.log('req.originUrl: ', req.originalUrl)
  console.log('req.path: ', req.path)
  console.log('req.params: ', req.params)
  // console.log('req.query: ', req.query)
  // console.log('req.route: ', req.route)
  
  // console.log('req.app: ', req.app)

  res.json(req.route)
}

const getCurrentBySymbol = async function (req, res, next){
  const {symbol} = req.params
  const url = process.env.STOCK_DATA_API_URL + `/aggregate/${symbol}/5min`
  
  if(!symbol) return next(new Error({ message: 'ticker symbol missing.' }))
  const response = await axios.get(url)
  const aggregate = response.data.aggregate
  console.log("length of ts:", aggregate.ts.length)
  const seed = Math.floor(Math.random() * aggregate.ts.length)
  const price= aggregate.ts[seed].open
  res.json({price: parseFloat(price)})

}

module.exports = {
  initTickers,
  searchTickers,
  getTickersByName,
  getTickerBySymbol,
  getTickerById,
  getCurrentBySymbol,
}

