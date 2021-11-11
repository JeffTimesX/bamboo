const mongoose = require('mongoose')
const { Schema } = mongoose;

const transactionSchema = new Schema(
	{ 
		issue_at: Date, 
		ticker: String, 
		amount: Number, 
		price: Number, 
		value: Number,
		type: String, 
	},{
		_id: false
	}
)

const tickerSchema = new Schema(
	{
		ticker: String, 
		amount: Number, 
	},{
		_id: false
	}
)
const exchangeAccountSchema = new Schema(
	{
		user: { 
			type: Schema.Types.ObjectId, ref: 'User' 
		},
		account_number: String,
		balance: Number,
		tickers: [ tickerSchema ],
		transactions: [ transactionSchema ]
	}
)

const paymentAccountSchema = new Schema({
	account: String,
	balance: Number,
	transactions: [ {issue_at: Date, value: Number, counterpart: String} ]
})


// create and export model
const PaymentAccount = mongoose.model('PaymentAccount', paymentAccountSchema)
const ExchangeAccount = mongoose.model('ExchangeAccount', exchangeAccountSchema)

module.exports = {
	PaymentAccount,
	ExchangeAccount
}
