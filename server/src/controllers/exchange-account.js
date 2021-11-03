const { DateTime } = require('luxon')
const axios = require('axios')

const { ExchangeAccount } = require('../models/account')
const User = require('../models/user')

// createAccount() - /create/:account/:userId/:amount
function createAccount(req, res, next) {
  if(req.params && req.params.account && req.params.userId){
    const { account, userId, amount } = req.params
    const newExchangeAccount = new ExchangeAccount({
      user: userId,
      account_number: account,
      balance: amount ? parseFloat(amount) : 0,
      tickers: [],
      transactions: []
    })
    ExchangeAccount
      .findOne({account_number: account})
      .exec(function(err,found) {
        if(err) return next(err)
        if(found) return res.json({error: 'account already exists'})
      })
    newExchangeAccount
      .save(newExchangeAccount)
      .then(function(saved) {
        console.log('new exchange account created: ' + saved.account_number)
        User
          .findByIdAndUpdate(userId,
            {"$push":{"paymentAccounts":saved._id}}
          )
          .exec(function(err, user){
            if(err) {
              console.log('registering exchange account to user error: ',err.message)
              return next(err)
            }
            console.log(`exchange account ${saved.account_number} registered to user ${user._id}`)
            return res.json(user)
          })
    })
  }else {
    console.log('req.params should have an account and an userId :', req.params )
    res.json({ message: 'req.params should have an account and an userId.' })
  }
}

// updateBalance() - /balance/:account/:amount
function updateBalance(req, res, next){
  if(req.params && req.params.account && req.params.amount){
    const { amount, account } = req.params
    ExchangeAccount
      .findByIdAndUpdate(account, 
        {})

  } else {
    console.log('req.params should have amount:', req.params )
    res.json({ message: 'req.params should have amount.' })
  
  }

}

// dealTicker()
function dealTicker(req, res, next){

}

// getAccountDetail()
function getAccountDetail(req, res, next){

}

// removeAccount()
function removeAccount(req, res, next){

}

module.exports = {
  removeAccount,
  getAccountDetail,
  dealTicker,
  updateBalance,
  createAccount
}