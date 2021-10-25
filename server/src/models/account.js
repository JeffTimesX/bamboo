import mongoose from 'mongoose';
const { Schema } = mongoose;

const exchangeAccountSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	account: String,
	tickers: [{
		ticker: String, 
		amount: Number, 
	}],
	transactions: [{ 
		issue_at: Date, 
		ticker: String, 
		amount: Number, 
		value: Number, 
	}]
})

const paymentAccountSchema = new Schema({
	account: String,
	balance: Number,
	transactions: [ {issue_at: Date, value: Number, counterpart: string} ]
})


// create and export model
const PaymentAccount = mongoose.model('PaymentAccount', paymentAccountSchema)
const ExchangeAccount = mongoose.model('ExchangeAccount', exchangeAccountSchema)

module.exports = {
	PaymentAccount,
	ExchangeAccount
}
