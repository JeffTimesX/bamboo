const express = require('express');
const router = express.Router();
const aggregatesController = require('../controllers/aggregates-controller.js');
const { checkJwt } = require('../auth/check-jwt')
const { hasPermission } = require('../auth/has-permission')
const { hasScope } = require('../auth/has-scope')

// the ticker route should be accessed with the access token.
// router.use(checkJwt)

router.get('/sync/:symbol', aggregatesController.syncAggregates );

router.get('/aggregate/:symbol/:interval', aggregatesController.getAggregateBySymbolAndInterval);



module.exports = router;