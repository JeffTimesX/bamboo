import mongoose from 'mongoose';
const { Schema } = mongoose;


const userSchema = new Schema({
  user_name:  String, // String is shorthand for {type: String}
  password: String,
  salt: String,
  email: String,

  nick_name: String,
  first_name: String,
  last_name: String,
  gender: String,
  date_of_birth: { type: Date },
  occupation: String,
  
  signup_at: { type: Date },
  login_at: { type: Date },
  portfolio: [{ type:Schema.Types.ObjectId, ref: 'Stock' }],
  watches: [{ type:Schema.Types.ObjectId, ref: 'Stock' }],
  exchanges: [{ type:Schema.Types.ObjectId, ref: 'Market' }],
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  follows: [{ type:Schema.Types.ObjectId, ref: 'User'}],
  paymentAccounts: [{ type:Schema.Types.ObjectId,ref: 'PaymentAccount'}],
  exchangeAccounts: [{ type:Schema.Types.ObjectId,ref: 'ExchangeAccount'}],
  Transactions: [{ type:Schema.Types.ObjectId,ref: 'Transaction'}]

});

userSchema
  .virtual('name')
  .get(function(err, name) {
    return this.first_name + ' ' + this.last_name
  })

