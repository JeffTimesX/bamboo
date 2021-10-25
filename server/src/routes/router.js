const router = require('express').Router();


// defining routers
// const index = require('./index')
const userRouter = require('./user')
const postRouter = require('./post')

// Users routes
router.use('/user', userRouter)
router.use('/post', postRouter)



// exports router
module.exports = router;