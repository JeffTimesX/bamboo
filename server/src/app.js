const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const helmet = require('helmet')
const logger = require('./util/logger')
require('dotenv').config()

const baseRouter = require('./routes/router')

const app = express()

// setting up database connections
const mongoose = require('mongoose') 
const mongoDb = process.env.DB_URL
const mongoAtlas = process.env.ATLAS_URL

// creating db connections
// use mongDB for localhost connections, use mongoAtlas for atlas connections.
// the {useNewUrlParser:true, useUnifiedTopology:true, use} option should be used.
// the {useFindAndModify:false} option should be used to avoid warning message when use findByIdAndModify()
mongoose.connect(mongoDb, { useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', function () {
    console.error.bind(console, 'MongoDB connection error.')
})

app.use(logger.dev, logger.combined)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())
app.use(helmet())

app.use('/', baseRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(res.locals.error);
});

module.exports = app;
