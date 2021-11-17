const mongoose = require('mongoose')
const { Schema } = mongoose;
const {DateTime} = require('luxon')

const postSchema = new Schema({
  title:  String, // String is shorthand for {type: String}
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  body:   String,
  comments: [{ 
    body: String, 
    date: { type: Date },
    author: {type: Schema.Types.ObjectId, ref: 'User'}
  }],
  date: { type: Date },
  hidden: Boolean,
  who_likes: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

// create and export model
module.exports = mongoose.model('Post', postSchema)