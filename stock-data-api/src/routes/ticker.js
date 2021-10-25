const express = require('express');
const router = express.Router();
const tickerController = require('../controllers/ticker-controller.js');
const { checkJwt } = require('../auth/check-jwt')
const { hasPermission } = require('../auth/has-permission')
const { hasScope } = require('../auth/has-scope')

// the ticker route should be accessed with the access token.
// router.use(checkJwt)

router.get('/init', tickerController.initTickers );

router.get('/search', tickerController.searchTickers);

router.get('/name/:name', tickerController.getTickersByName);

router.get('/symbol/:symbol', tickerController.getTickerBySymbol);

router.get('/id/:id', tickerController.getTickerById);


module.exports = router;