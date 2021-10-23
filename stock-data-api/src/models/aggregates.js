
const mongoose = require('mongoose')
const Schema = require('mongoose').Schema

const tickSchema = new Schema(
  { 
    "timestamp": String,
    "open": String,
    "high": String,
    "low": String,
    "close": String,
    "volume": String
  }
)

const metaSchema = new Schema(
  {
    "information": String,
    "symbol": String,
    "last_refreshed": String,
    "interval": String,
    "output_size": String,
    "time_zone": String
  }
)

const aggregateSchema = new Schema(
  {
    meta: metaSchema,
    ts: [tickSchema]
  }
)

/**
 * aggregate {
 *  meta: {
 *     "information": "Intraday (60min) open, high, low, close prices and volume",
 *     "symbol": "IBM",
 *     "last_refreshed": "2021-10-20 20:00:00",
 *     "interval": "60min",
 *     "output_size": "Compact",
 *     "time_zone": "US/Eastern"
 *  }
 *  ts: [
 *    {
 *      "timestamp": "2021-10-20 20:00:00",
 *      "interval": "60min"
 *      "open": "135.9400",
 *      "high": "135.9800",
 *      "low": "135.6600",
 *      "close": "135.8500",
 *      "volume": "23370"
 *    },
 *    {
 *      time_stamp: "2021-10-20 20:01:00",
 *      "interval": "60min"
 *      "open": "135.9400",
 *      "high": "135.9800",
 *      "low": "135.6600",
 *      "close": "135.8500",
 *      "volume": "23370"
 *    },
 *    ...
 *  ]
 * }
 */

// create and export model
const Aggregate = mongoose.model('Aggregate', aggregateSchema)
const Tick = mongoose.model('Tick', tickSchema)
const Meta = mongoose.model('Meta', metaSchema)

module.exports = {
  Aggregate,
  Tick,
  Meta,
}