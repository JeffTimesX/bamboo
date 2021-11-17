const express = require('express');
const router = express.Router();

const { checkJwt } = require('../auth/check-jwt')
const { hasPermission } = require('../auth/has-permission')

const exchangeAccountController = require('../controllers/exchange-account');

router.get('/detail/:id', checkJwt, hasPermission('read:user'), exchangeAccountController.getAccountDetail)
router.post('/create/:userId', checkJwt, hasPermission('write:user'), exchangeAccountController.createAccount)
router.post('/balance/:id', checkJwt, hasPermission('write:user'), exchangeAccountController.updateBalance)
router.post('/deal/:id/', checkJwt, hasPermission('write:user'), exchangeAccountController.dealTicker)
router.delete('/remove/:id', checkJwt, hasPermission('write:user'), exchangeAccountController.removeAccount)

module.exports = router;