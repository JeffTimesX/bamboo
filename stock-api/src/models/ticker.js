
const mongoose = require('mongoose')
const Schema = require('mongoose').Schema
const { DateTime } = require('luxon')


// create schema for catalog
const tickerSchema = new Schema( 
  {
    "ticker": String,
    "name": String,
    "market": String,
    "locale": String,
    "primary_exchange": String,
    "type": String,
    "active": Boolean,
    "currency_name": String,
    "cik": String,
    "composite_figi": String,
    "share_class_figi": String,
    "last_updated_utc": String
  }
)

// create and export model
module.exports = mongoose.model('Ticker', tickerSchema)