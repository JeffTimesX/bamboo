const express = require('express');
const router = express.Router();

const user = require('../controllers/user.js');



router.get('/profile/:sub', user.getProfile)
router.post('/profile/:sub', user.updateProfile)

router.get('/portfolio/:sub', user.getPortfolio)
router.post('/portfolio/:sub', user.updatePortfolio);
//router.delete('/portfolio/:sub', user.deleteFromPortfolio)

router.get('/watches/:sub', user.getWatches);
router.post('/watches/:sub', user.updateWatches);
// router.delete('/watches/:sub', user.deleteFromWatches)

router.get('/user/:sub', user.getUserBySub) 
router.post('/user/:sub', user.updateUserBySub)
router.delete('/user/:id', user.deleteUserById)
router.get('/posts/:userId', user.getPosts)
 
// router.post('/posts/:sub', user.addToPosts)
// router.put('/posts/:sub', user.updateToPosts)
// router.delete('/posts/:sub', user.deleteFromPosts)

// router.get('/follows/:sub', user.getFollows);
// router.post('/follows/:sub', user.addToFollows)
// router.put('/follows/:sub', user.updateToFollows)
// router.delete('/follows/:sub', user.deleteFromFollows)

// router.get('/payment-accounts/:sub', user.getPaymentAccounts);
// router.post('/payment-accounts/:sub', user.addToPaymentAccounts)
// router.put('/payment-accounts/:sub', user.updateToPaymentAccounts)
// router.delete('/payment-accounts/:sub', user.deleteFromPaymentAccounts)


// router.get('/exchange-accounts/:sub', user.getExchangeAccounts);
// router.post('/exchange-accounts/:sub', user.addToExchangeAccounts)
// router.put('/exchange-accounts/:sub', user.updateToExchangeAccounts)
// router.delete('/exchange-accounts/:sub', user.deleteFromExchangeAccounts)


module.exports = router;
