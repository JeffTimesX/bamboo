const router = require('express').Router();


// defining routers
// const index = require('./index')
const userRouter = require('./user')
const postRouter = require('./post')
const exchangeRouter = require('./exchange')

// Users routes
router.use('/user', userRouter)
router.use('/post', postRouter)
router.use('/exchange-account', exchangeRouter)



// exports router
module.exports = router;