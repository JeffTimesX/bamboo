const express = require('express');
const router = express.Router();
const tickerController = require('../controllers/ticker-controller.js');
const { checkJwt } = require('../auth/check-jwt')
const { hasPermission } = require('../auth/has-permission')
const { hasScope } = require('../auth/has-scope')


// checkJwt, hasPermission('manage:stock'),
router.get('/init',  tickerController.initTickers );

router.get('/search', tickerController.searchTickers);

router.get('/name/:name', tickerController.getTickersByName);

router.get('/symbol/:symbol', tickerController.getTickerBySymbol);

router.get('/id/:id', tickerController.getTickerById);

// router.get('/current/:symbol', checkJwt, hasPermission('read:stock'), tickerController.getCurrentBySymbol);
router.get('/current/:symbol', checkJwt, tickerController.getCurrentBySymbol);

module.exports = router;