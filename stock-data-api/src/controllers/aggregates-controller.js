// ticker-controller
const { token } = require('morgan')
const { FAILED_DEPENDENCY } = require('http-status')

const axios = require('axios')
const { Aggregate, Tick, Meta } = require('../models/aggregates')

// configurations for accessing alphaVantage.co aggregates source.
const aggregatesEndpoint = process.env.ALPHA_AGGREGATES
const apiKey = process.env.ALPHA_API_KEY
const outputSize = process.env.ALPHA_OUTPUT_SIZE

const sourceFunc = {
  daily: 'TIME_SERIES_DAILY',
  intraday: 'TIME_SERIES_INTRADAY'
}

const interval = {
  oneMinute: '1min',
  fiveMinutes: '5min',
  fifteenMinutes: '15min',
  thirtyMinutes: '30min',
  oneHour: '60min',
  daily: 'Daily'
}

/**
 * synchronize the 5min interval Intraday aggregates
 * and daily history aggregates to local database.
 * `https://www.alphavantage.co/query?function=${TIME_SERIES_DAILY/TIME_SERIES_INTRADAY}&symbol=${symbol}&apikey=${HISHIS8F8CUE8LR8N9N}&interval=${1min/5min/15min/30min/60min}&outputsize=${compact/full}`
 */
const sourcingAggregates = async function (req, res, next) {
  
  let dailyResult = null
  let intradayResult = null
  const { symbol } = req.params

  function fetchDailyAggregate(symbol) {
    const url = `${aggregatesEndpoint}apikey=${apiKey}&function=${sourceFunc.daily}&symbol=${symbol}&outputsize=${outputSize}`
    return axios.get(url)
  }

  async function fetchIntradayAggregate(symbol, int) {
    const url = `${aggregatesEndpoint}apikey=${apiKey}&function=${sourceFunc.intraday}&symbol=${symbol}&outputsize=${outputSize}&interval=${int}`
    return axios.get(url)
  }
  
  /**
   * 
   * @param {*} symbol the ticker symbol.
   * @param {*} intervalArg the interval parameter, intervals in the enum allowed.
   * @returns { aggregate }
   */
  async function fetchAggregate(symbol, intervalArg){  
    if(!symbol || !intervalArg) return next(new Error('symbol or interval params missing.')) 
    if(intervalArg === interval.daily){
      return await fetchDailyAggregate(symbol)
    } else {
      return await fetchIntradayAggregate(symbol, intervalArg)
    }
  }

  /**
   * 
   * @param {*} key the original name if time series property
   * @returns the transferred name
   */
  function transTimeSeriesKeyName(key){
    return 'ts_' + key.split(' ')[2].slice(1,-1).toLowerCase()
  }

  function transMetaDataKeyName(key){
    return key.toLowerCase().split(' ').join('_')
  }
  
    // trans data model. 
function transferAggregateKeyName(aggregate){
  const transArray = Object.keys(aggregate).map((key) => {
    let transferredKey = null
    if (key.includes('Meta')){ 
      transferredKey = transMetaDataKeyName(key)
    } else if (key.includes('Time')) {
      transferredKey = transTimeSeriesKeyName(key)
    } else {
      transferredKey = 'unknown_key'
    }
    return { [transferredKey] : aggregate[key] }
  })

  let transferredAggregate = {} 
  transArray.forEach ( item => {
    return transferredAggregate = {...transferredAggregate, ...item} 
  }) 
  return transferredAggregate
}

function transferSubDocumentKeyName( subDocument ) {
  const transArray = Object.keys(subDocument).map( key => {
    const transferredKey = key.slice(3).toLowerCase().split(' ').join('_')
    return { [transferredKey] : subDocument[key] }
  })
  let transferredSubDocument = {} 
  transArray.forEach( item => {
    return transferredSubDocument = {...transferredSubDocument, ...item }
  })
  return transferredSubDocument
}
/**
 * 
 * @param {*} aggregate 
 * @returns { metaKeysTransferred, tsArrayTransferred }
 */
function formatAggregate(aggregate) {
  let tsKey = null
  // first level keys' name transferred
  const firstLevelKeysTransferred = transferAggregateKeyName( aggregate )
  // transferring meta_data properties' name
  let metaKeysTransferred = transferSubDocumentKeyName( firstLevelKeysTransferred['meta_data'])
  
  // add 'daily' interval to meta_data if the aggregate is a daily one.
  // setting TS key by the type of the interval type
  if(metaKeysTransferred.information.includes('Daily')){
    tsKey = 'ts_daily',
    metaKeysTransferred = { ...metaKeysTransferred, interval: 'daily' }
  } else if (metaKeysTransferred.information.includes('(5min)')) {
    tsKey = 'ts_5min'
  } else if (metaKeysTransferred.information.includes('(15min)')) {
    tsKey = 'ts_15min'
  } else if (metaKeysTransferred.information.includes('(30min)')) {
    tsKey = 'ts_30min'
  }else if (metaKeysTransferred.information.includes('(60min)')) {
    tsKey = 'ts_60min'
  }
  // transferring time series object to an array of tick documents.
  const originalTs = firstLevelKeysTransferred[tsKey]
  const tsArrayTransferred = Object.keys(originalTs).map( key => {
    return (
      { 
        timestamp: key, 
        ...transferSubDocumentKeyName( originalTs[key] ) 
      }
    )
  }) 
  return (
    { 
      meta_data: metaKeysTransferred, 
      [tsKey]: tsArrayTransferred
    }
  )
}

  /**
   * save
   * @param {*} aggregate 
   * @returns aggregate.meta_data if saved
   */
   async function saveAggregate(aggregate) {
    if(aggregate['meta_data'].information.includes('Daily')){
      tsKey = 'ts_daily'
    } else if (aggregate['meta_data'].information.includes('(5min)')) {
      tsKey = 'ts_5min'
    } else if (aggregate['meta_data'].information.includes('(15min)')) {
      tsKey = 'ts_15min'
    } else if (aggregate['meta_data'].information.includes('(30min)')) {
      tsKey = 'ts_30min'
    }else if (aggregate['meta_data'].information.includes('(60min)')) {
      tsKey = 'ts_60min'
    }
    
    const meta = aggregate['meta_data']
    const ticks = aggregate[tsKey]
    // creating sub-document array of ts.
    const tickSubDocArray = ticks.map((tick) => {
      return new Tick(tick)
    })
    
    const metaSubDoc = new Meta(meta)
    // creating aggregate document.
    const aggregateDoc = new Aggregate({
      meta: metaSubDoc,
      ts: tickSubDocArray
    } )
    console.log("To save timesSeries[0]: ", tickSubDocArray[0])
    console.log("To save meta: ", metaSubDoc)
    
    // saving the document.
    return aggregateDoc.save()
  }

  //====================================================================//

  // take and check the ticker symbol from req.params
  !symbol && res.json({ message: 'input symbol is missing.'})

  // fetch an aggregates from intraday access point or daily access point 
  // from alphaVantage endpoint according to the setting of 'interval'
  try {
    const fetchAggregatesResults = await Promise.all([
      fetchAggregate(symbol, interval.daily), 
      fetchAggregate(symbol, interval.oneHour),
      fetchAggregate(symbol, interval.thirtyMinutes),
      fetchAggregate(symbol, interval.fifteenMinutes), 
      fetchAggregate(symbol, interval.fiveMinutes)
    ])
    

    // map the results fran an of aggregates to an array
    // of promises, then pass the array to Promise.all() 
    // to resolve the aggregate.save()
    const saveAggregatePromises = fetchAggregatesResults.map((result) =>{
      const aggregate = result.data
      const formatted = formatAggregate(aggregate)
      console.log("formatted aggregate meta : ", formatted.meta_data )
      return saveAggregate(formatted)
    })

    const status = await Promise.all(saveAggregatePromises)
    status.forEach(state=>{
      console.log(`${state.ts.length} ticks data saved with meta: `, state.meta)
    })
    req.fetchSource = { message: `${status.length} aggregates saved.`}
    return next()

  } catch (err) {
    console.log(err)
    next(new Error({message: 'get aggregates failed.'}))
  }
}

const syncAggregates = [
  sourcingAggregates,
  (req, res, next) =>{
    if(req.fetchSource) return res.json(req.fetchSource)
    return next(new Error({message: 'get aggregates failed.'}))
  }
]

/**
 * getAggregateBySymbolAndInterval() takes the req.params and 
 * return the matched aggregate.
 */


const getAggregateBySymbolAndIntervalLocally = function (req, res, next) {

  const { symbol, interval } = req.params
  console.log(symbol, interval)
  // if find() document meta matches the given 'symbol' and 'interval',  res.json() it.
  // otherwise, souringAggregates(symbol) and try again 
  Aggregate
    .find({'meta.symbol':'IBM'})
    .exec(function (err, aggregates) {
      if(err) return next(err)
      console.log(aggregates[0])
      res.json(aggregates[0])
    })
}

const getAggregateBySymbolAndInterval = [
  getAggregateBySymbolAndIntervalLocally
]

module.exports = {

  syncAggregates,
  getAggregateBySymbolAndInterval,

}