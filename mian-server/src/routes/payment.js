const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/payment');

// processing payment to stripe 
router.post('/checkout', paymentController.createCheckoutSession)

// processing payment response from Stripe
router.get('/response/:status', paymentController.checkPaymentResponse)

module.exports = router;
