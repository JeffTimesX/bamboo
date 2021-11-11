const express = require('express');
const router = express.Router();

const exchangeAccountController = require('../controllers/exchange-account');

router.get('/detail/:id', exchangeAccountController.getAccountDetail)
router.post('/create/:userId', exchangeAccountController.createAccount)
router.post('/balance/:id', exchangeAccountController.updateBalance)
router.post('/deal/:id/', exchangeAccountController.dealTicker)
router.delete('/remove/:id', exchangeAccountController.removeAccount)

module.exports = router;