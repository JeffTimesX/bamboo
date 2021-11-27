const express = require('express');
const router = express.Router();

const { checkJwt } = require('../auth/check-jwt')
const { hasPermission } = require('../auth/has-permission')
const { hasScope } = require('../auth/has-scope')

const paymentController = require('../controllers/payment');

// processing payment to stripe 
// router.post('/checkout', checkJwt, hasPermission('write:user'), paymentController.createCheckoutSession)
router.post('/checkout', checkJwt, paymentController.createCheckoutSession)

// processing payment response from Stripe
router.get('/response/:status', paymentController.checkPaymentResponse)

module.exports = router;
