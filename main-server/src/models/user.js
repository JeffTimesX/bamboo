const mongoose = require('mongoose')
const { Schema } = mongoose

const portfolioSchema = new Schema (
  {
    ticker: String,
    inventory: Number,
    purchased_at: Date 
  },
  {_id: false}
)

const watchesSchema = new Schema (
  {
    ticker: String,
    watched_at: Date
  },
  {_id: false}
)

const userSchema = new Schema({
  profile: { 
    auth: {
      nickname: String,
      name:  String, // String is shorthand for {type: String}
      email: String,
      picture: String,
      updated_at: String,
      email_verified: Boolean,
      sub: String
    },
    ext: { 
      first_name: String,
      last_name: String,
      gender: String,
      date_of_birth: { type: Date },
      occupation: String
    }
  },

  // the data model of portfolio and watches should be changed to [{ ticker: String, inventory: Number }] 
  portfolio: [portfolioSchema],
  watches: [watchesSchema],
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  follows: [{ type:Schema.Types.ObjectId, ref: 'User'}],
  paymentAccounts: [{ type: Schema.Types.ObjectId, ref: 'PaymentAccount' }],
  exchangeAccounts: [{ type: Schema.Types.ObjectId, ref: 'ExchangeAccount' }],
});

userSchema
  .virtual('name')
  .get(function(err, name) {
    return this.profile.first_name + ' ' + this.last_name
  })

// create and export model
module.exports = mongoose.model('User', userSchema)