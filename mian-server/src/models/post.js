const mongoose = require('mongoose')
const { Schema } = mongoose;

const postSchema = new Schema({
  title:  String, // String is shorthand for {type: String}
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  body:   String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  who_likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  meta: {
    votes: Number,
    favs:  Number
  }
})

// create and export model
module.exports = mongoose.model('Post', postSchema)