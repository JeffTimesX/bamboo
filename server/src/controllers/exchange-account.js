const { DateTime } = require('luxon')
const axios = require('axios')

const { ExchangeAccount } = require('../models/account')
const User = require('../models/user')
const { findByIdAndRemove } = require('../models/user')

// createAccount() - /create/:userId
// return updated user profile.
function createAccount(req, res, next) {
  
  if( req.params && 
    req.params.userId && 
    req.body && 
    req.body.user && 
    req.body.account_number
    ) {
    const { account_number, user, amount } = req.body
    const { userId } = req.params
    if(user !== userId) return next( new Error("user id in the request body does not match."))
  
    //check if the account is already exists.
    ExchangeAccount
      .findOne({
        account_number: account_number,
        user: userId
      })
      .exec(function(err,found) {
        if(err) {
          console.log(err)
          return next(err)
        }
        if(found) return res.json({error: 'account already exists', account: found})
        
        const newExchangeAccount = new ExchangeAccount({
          user: user,
          account_number: account_number,
          balance: amount ? parseFloat(amount) : 0,
          tickers: [],
          transactions: [{
            issue_at: DateTime.now().toISO(),
            ticker: 'Transfer', 
            amount: amount,
            type: 'transfer_in'
          }]
        })
        
        console.log("new account: " + newExchangeAccount)
        
        newExchangeAccount
          .save()
          .then(function(saved) {
            console.log('new exchange account created: ' + saved.account_number)
            User
              .findByIdAndUpdate(
                userId,
                {"$push":{exchangeAccounts: saved._id}},
                {new: true}
              )
              .populate('exchangeAccounts')
              .exec(function(err, user){
                if(err) {
                  console.log('registering exchange account to user error: ',err.message)
                  return next(err)
                }
                console.log(`exchange account ${saved.account_number} registered to user ${user._id}`)
                return res.json(user)
              })
          })
          .catch(function(err){
            console.log(err)
            return next(err)
          })
      })
  }else {

    console.log('req.params should have an userId :', req.params )
    return res.json({ message: 'req.params should have an userId.' })
  
  }
}

// updateBalance() - /balance/:id {accountId, amount, account_number} in the body
function updateBalance(req, res, next){
  if(req.params && 
    req.params.id && 
    req.body && 
    req.body.accountId &&
    req.body.account_number &&
    req.body.amount){
    const { id } = req.params
    const { accountId, amount, account_number } = req.body
    if(accountId !== id) return res.json({ message: 'mismatched params.id and body.accountId.'})
    ExchangeAccount
      .findOneAndUpdate(
        { _id: accountId, account_number: account_number  }, 
        { "$inc": { balance: amount }},
        { upsert: true, new: true }
      )
      .exec(function(err, account){
        if(err) {
          console.log('update balance error: ',err.message)
          return next(err)
        }
        return res.json(account)
      })

  } else {
    console.log('req.params should have id:', req.params )
    return res.json({ message: 'req.params should have id.' })
  
  }
}


// getAccountDetail() - /detail/:account
function getAccountDetail(req, res, next){

  if(!req.params || !req.params.id) {
    console.log('req.params should have an account:', req.params )
    return res.json({ message: 'req.params should have an account.' })
  }
  const { id } = req.params
  console.log('found account with id:', id)
  ExchangeAccount
    .findById(id)
    .exec(function(err, account){
      if(err) return next(err)
      return res.json(account)
    })
}

// dealTicker() - /deal/:id
function dealTicker(req, res, next){
  if(!req.params || 
    !req.params.id || 
    !req.body ||
    !req.body.accountId || 
    !req.body.ticker ||
    !req.body.amount || 
    !req.body.type ||
    !req.body.price ) {
    console.log('accountId, ticker, amount, price, type, parameters missing: ', req.params )
    return res.json({message: 'ticker,amount, price, parameters missing.'})
  }

  if(req.params.id !== req.body.accountId) {
    console.log('req.params.id !== req.body.accountId')
    return res.json({message:'req.params.id !== req.body.accountId'})
  }

  const { 
    accountId, 
    ticker, 
    amount, 
    type, 
    price
  } = req.body

  const deltaDir = type.trim() === 'buy' ? -1 : 1
  const deltaBalance = parseInt(amount) * parseFloat(price) * deltaDir
  const adjustedAmount = -1 * deltaDir * amount

  console.log("delta: ", deltaBalance)
  // update the tickers[], transactions[] to log this deal.
  // update the balance.
  ExchangeAccount
    .findById(accountId)
    .where('tickers.ticker').equals(ticker)
    .exec(function(err, found) {
      if(err) return next(err)
      if(!found) {
        console.log('ticker does not exist in the tickers list, push a new record.')
        ExchangeAccount
          .findByIdAndUpdate( 
            accountId,
            {
              "$inc": { balance: deltaBalance },
              "$push": { 
                transactions: {
                  issue_at: DateTime.now().toISO(),
                  ticker: ticker, 
                  amount: amount,
                  price: parseFloat(price),
                  type: type,
                  total: deltaBalance,
                },
                tickers: { 
                  ticker: ticker, 
                  amount: adjustedAmount 
                }
              }
            },{
              upsert: true, 
              new: true 
            }
          )
          .exec(function(err, created) {
            if (err) return next(err)
            console.log('new record created: ', created.tickers)
            return res.json(created)
          })   
      } else {
        console.log("ticker record found in the exchange account tickers list, updating the amount.")
        ExchangeAccount
          .findOneAndUpdate(
            {
              _id:accountId, 
              "tickers.ticker": ticker
            },{
              "$inc": { 
                balance: deltaBalance,
                "tickers.$[i].amount": adjustedAmount,
              },
              "$push": { 
                transactions: {
                  issue_at: DateTime.now().toISO(),
                  ticker: ticker, 
                  amount: amount,
                  price: parseFloat(price),
                  type: type,
                  total: deltaBalance
                }
              }
            },{
              arrayFilters: [ 
                {"i.ticker": ticker}
              ],
              upsert: true, 
              new: true
            }
          )
          .exec(function (err, updated) {
            if (err) return next(err)
            console.log('account record updated: ', updated.tickers)
            return res.json(updated)
          })
      }
    })    
}

// removeAccount() - /remove/:id
function removeAccount(req, res, next){
  if(!req.params || !req.params.id) return next(new Error({message:'account id is required.'}))
  const { id } = req.params
  //get the related user _id
  //remove the account id from the user profile.auth
  //delete the account.
  ExchangeAccount
    .findByIdAndRemove(id)
    .exec(function(err, account){
      if(err) return next(err)
      // const _id = new ObjectId(id)
      const uid = account.user
      console.log('related userId: ', uid)
      User
        .findByIdAndUpdate(
          uid,
          {
            "$pull": { exchangeAccounts: id }
          },
          {new: true}
        )
        .exec(function(err, user){
          if(err) return next(err)
          return res.json({account: account, user: user})
        })
    })
}


module.exports = {
  removeAccount,
  getAccountDetail,
  dealTicker,
  updateBalance,
  createAccount
}