const router = require('express').Router();


// defining routers
// const index = require('./index')
const userRouter = require('./user')
const tickerRouter = require('./ticker')
const aggregatesRouter = require('./aggregates')






// Users routes
router.use('/user', userRouter)
router.use('/ticker', tickerRouter)
router.use('/aggregate', aggregatesRouter)


// exports router
module.exports = router;