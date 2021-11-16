const express = require('express');
const router = express.Router();
const aggregatesController = require('../controllers/aggregates-controller.js');
const { checkJwt } = require('../auth/check-jwt')
const { hasPermission } = require('../auth/has-permission')
const { hasScope } = require('../auth/has-scope')

// the ticker route should be accessed with the access token.
// router.use(checkJwt)

router.get('/sync/:symbol', checkJwt, hasPermission('manage:stock'), aggregatesController.syncAggregates );

// this route should not been protected, because the home page carousel
// approaches this endpoint for getting the data to fill up the home page charts.
router.get('/:symbol/:interval', aggregatesController.getAggregateBySymbolAndInterval);



module.exports = router;