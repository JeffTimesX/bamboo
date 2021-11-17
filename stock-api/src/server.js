
// Patches
const {inject, errorHandler} = require('express-custom-error');
inject(); // Patch express in order to use async / await syntax

// Require Dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');

// setup logging
const logger = require('./util/logger');

// Load .env Environment Variables to process.env
require('dotenv').config()

// cors options
const corsOptions = {
    origin: process.env.FRONT_END_DOMAIN,
    credentials: true, 
    preflightContinue: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// configuring listening port
const { PORT } = process.env;


// setting up database connections
const mongoose = require('mongoose') 
const mongoDb = process.env.DB_URL


// creating db connections
// use mongDB for localhost connections, use mongoAtlas for atlas connections.
// the {useNewUrlParser:true, useUnifiedTopology:true, use} option should be used.
// the {useFindAndModify:false} option should be used to avoid warning message when use findByIdAndModify()
mongoose.connect(mongoDb, { useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', function () {
    console.error.bind(console, 'MongoDB connection error.')
})

// Instantiate an Express Application
const app = express();

// Configure Express App Instance
app.use(express.json( { limit: '50mb' } ));
app.use(express.urlencoded( { extended: true, limit: '10mb' } ));

// Configure custom logger middleware
app.use(logger.dev, logger.combined);

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet());

// This middleware adds the json header to every response
app.use('*', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
})

// Assign Routes
app.use('/', require('./routes/router.js'));


// Handle errors
app.use(errorHandler());

// Handle not valid route
app.use('*', (req, res) => {
    res
    .status(404)
    .json( {status: false, message: 'Endpoint Not Found'} );
})

// Open Server on selected Port
app.listen(
    PORT,
    () => console.info('Stock API Server listening on port ', PORT)
);