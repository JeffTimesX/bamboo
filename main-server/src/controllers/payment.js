const stripe = require('stripe')('sk_test_51JtDbsAmW8hyDTJfxXwiuhscA168qKfOUox9GrqBYo2GQaTaRIIJhFdfR49eqe6cjBrUukK3xerP8sGuPZ5ISdEe00Ei5cXWhW');

const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const cors = require('cors');
const { default: axios } = require('axios');

const secret = crypto.randomBytes(64).toString('hex')

const PaymentEndpoint = process.env.PAYMENT_ENDPOINT;
const frontEndPaymentReturned = process.env.FRONT_END_PAYMENT_RETURNED
const updateBalanceEndpoint = process.env.UPDATE_BALANCE_ENDPOINT

async function createCheckoutSession (req, res, next) {
  
  const { 
    user,
    accountId,
    account_number,  
    value,
    currency
  } = req.body

  const accessToken = req.headers.authorization.split(' ')[1]
  
  // console.log("createCheckoutSession() received accessToken : ", accessToken)
  // console.log('checkoutEndpoint.createCheckoutSession() req.body: ', req.body)
  
  // checking the input of the request.
  if(!user) {
    const err = new Error('createCheckoutSession() report: user id not provided.')
    console.log(err)
    return res
      .status(401)
      .json(err)
  }
  if(!currency || 
    !accountId ||
    !account_number || 
    !value) {
      const err = new Error('createCheckoutSession() report: some of the currency, accountId, account_number, value are missing.')
      console.log(err)
      return res
        .status(401)
        .json(err)
  }


  // creating the stripe session.
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: { 
            currency: currency,
            product_data: { name: 'popup ' + account_number },
            unit_amount: 100,
          },
          quantity: value,
        },
      ],
      payment_method_types: [
        'card',
      ],
      mode: 'payment',
      success_url: `${PaymentEndpoint}/payment/response/success`,
      cancel_url: `${PaymentEndpoint}/payment/response/cancel`,
    });
  
    const receipt = {
      user: user,
      accountId: accountId,
      account_number: account_number,  
      value: value,
      currency: currency
    }
  
    const signedReceipt = jwt.sign(receipt, secret)
    
    // console.log('signed receipt: ', signedReceipt)  
  
    // directing user to stripe checkout endpoint.
    // returns the session.url to frontend, let frontend 
    // redirect the user agent to stripe.com 
    res
      .header({
        'Content-Type': 'application/json',
        //'Access-Control-Allow-Credentials': true,
        //'Access-Control-Allow-Origin': 'http://localhost:3000',
        //'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
        //'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      })
      .cookie('receipt', signedReceipt, {sameSite: false})
      .cookie('accessToken', accessToken, {sameSite: false} )
      .json({url:session.url})
  
  } catch (err) {
    console.log('createCheckoutSession() error: ', err)
  }
}


// update the balance by calling '/exchange/balance/:id' endpoint.
// redirect user back to the frontend with params either 
// success, cancel or failure.
// if returns with success or cancel, the res.status = 200
// res.status = 500 if the redirect is processed with failure.
async function checkPaymentResponse (req, res, next) {

  console.log('params:', req.params)

  const { status: responseStatus } = req.params
  const { receipt, accessToken } = req.cookies

  console.log('checkPaymentResponse() received accessToken: ', accessToken )

  let url = frontEndPaymentReturned + '/' + responseStatus
  
  // stripe returned without status, failure.
  if(!responseStatus) {

    url = frontEndPaymentReturned + '/' + 'stripe-failure'
    return res.redirect(302, url)

  // stripe returned with cancel status.
  } else if (responseStatus === 'cancel') {

    url = frontEndPaymentReturned + '/' + 'cancel'
    return res.redirect(302, url)

  // the receipt is missing on the turned back request.
  } else if(!receipt){
      url = frontEndPaymentReturned + '/' + 'receipt-missing'
      return res.redirect(302, url)

  } else if(!accessToken) {
    
    url = frontEndPaymentReturned + '/' + 'accessToken-missing'
    return res.redirect(302, url)

  }else if(receipt && accessToken) {
    
    try{

      const verifiedReceipt = jwt.verify(receipt, secret)

      console.log('received receipt: ', verifiedReceipt)
  
      const { accountId, value, account_number} = verifiedReceipt
  
      // the receipt params are missing.
      if(!accountId || !value || !account_number) {
  
        url = frontEndPaymentReturned + '/' + 'receipt-params-missing'
        return res
          .clearCookie('receipt')
          .redirect(302, url)
  
      } else {
  
        const updateExchangeAccountUrl = updateBalanceEndpoint + '/' + accountId
        
        const response = await axios.post(
          updateExchangeAccountUrl,
          {
            accountId: accountId,
            account_number: account_number,
            value: value
          },
          {
            headers: { Authorization: `Bearer ${accessToken}`}
          }
        )
  
        const updatedExchangeAccount = response.data
        
        console.log('updated exchange account: ', updatedExchangeAccount)
        
        url = frontEndPaymentReturned + '/' + 'account-updated'
        return res
        .clearCookie('receipt')
        .redirect(302, url)
  
      }

    } catch(err) {
      console.error('verifying access token failed: ', err)
      url = frontEndPaymentReturned + '/' + 'verifying-receipt-failed'
      return res
        .clearCookie('receipt')
        .redirect(302, url)
    }
    
    
  }
}

module.exports = {
  createCheckoutSession,
  checkPaymentResponse,
}

/** 
 * possible conditions:
 * c1. receive a request to create a new exchange account with 0 init balance
 * c2. a create request with inti balance
 * c3. a popup request with balance
 * c4. a popup request with 0 balance
 * 
 * c1 should be returned immediately with exchange account created, without
 * call stripe api. 
 * 
 * c2 should create exchange account, register it to the userId before 
 * creating the session to stripe api. then update the result after stripe
 * api call turned back.
 * 
 * c3 should update the exchange account after receives the turned back
 * from the stripe api call.
 * 
 * c4 should returned immediately without any action.
*/
