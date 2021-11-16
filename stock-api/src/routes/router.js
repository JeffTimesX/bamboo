const router = require('express').Router();


// defining routers
const tickerRouter = require('./ticker')
const aggregatesRouter = require('./aggregates')

// routes
router.use('/ticker', tickerRouter)
router.use('/aggregate', aggregatesRouter)


// exports router
module.exports = router;