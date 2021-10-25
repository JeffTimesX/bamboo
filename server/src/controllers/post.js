const { models } = require('mongoose')
const Post = require('../models/post')
const User = require('../models/user')

const getPostById = function (req, res, next) {
  const {id} = req.params
  Post
    .findById(id)
    .exec(function (err, post){
      if (err) return next(err)
      res.json(post)
    })
}

const getPostsByUserId = function (req, res, next) {
  const {id} = req.params
  Post
    .find({author: id})
    .exec(function (err, posts){
      if (err) return next(err)
      res.json(posts)
    })
}

const getPostsByTitle = function (req, res, next){
  const {title} = req.params
  const re = new RegExp( `^${title}$`, 'i')
  Post
    .find({
      title: {"$in": re}
    })
    .exec(function (err, posts){
      if (err) return next(err)
      res.json(posts)
    })

}

// createPost()
const createPost = async function (req, res, next) {
  const {userId} = req.params
  const {post} = req.body
  console.log(userId, post)
  const newPost = new Post({
    author: userId, 
    ...post
  })

  newPost
    .save()
    .then((saved) => {
      const postId = saved._id
      console.log("saved", postId)
      
      User
        .findByIdAndUpdate(
          userId,
          { "$push":{ "posts": postId }}
        )
        .exec((err, found) => {
          if (err) return next(err)
          res.json(found)
        })

    })
    .catch((err) => next(err))
}


const deletePost = function (req, res, next) {

  const { id } = req.params
  Post
    .findByIdAndDelete(id)
    .exec(function (err, found){
      if (err) return next(err)
      return res.json(found)
    })
}

module.exports = {
getPostById,
getPostsByUserId,
getPostsByTitle,
createPost,
deletePost
}