const express = require('express');
const router = express.Router();

const exchangeAccountController = require('../controllers/exchange-account.js');

router.get('/detail', exchangeAccountController.getAccountDetail)
router.post('/create/:account/:userId/:amount', exchangeAccountController.createAccount)
router.post('/balance/:account/:amount', exchangeAccountController.updateBalance)
router.post('/deal/:ticker/:amount/:price', exchangeAccountController.dealTicker)
router.delete('/remove/:id', exchangeAccountController.removeAccount)

module.exports = router;