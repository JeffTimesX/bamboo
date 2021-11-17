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

const getPosts = function (req, res, next) {
  Post
    .find({})
    .populate({path: 'author', select: 'profile.auth.nickname'})
    .populate({path: 'comments.author', select: 'profile.auth.nickname'})
    .exec(function (err, posts){
      if(err) return next(err)
      res.json(posts)
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

const commentPost = function (req, res, next) {
  const {id} = req.params
  const comment = req.body
  
  console.log(id, comment)

  if(!id || !comment) return res.status(402).json({error:'id or comment is missing.'})

  Post
    .findByIdAndUpdate(
      id,
      { "$push":{ "comments": comment }},
      { upsert: true, new: true }
    )
    .populate({path: 'author', select: 'profile.auth.nickname'})
    .populate({path: 'comments.author', select: 'profile.auth.nickname'})
    .exec((err, post) => {
      if (err) return next(err)
      return res.json(post)
    })
}

const likePost = function (req, res, next) {
  
  const {id} = req.params
  const {who, like} = req.body
  
  console.log(id, who)

  if(!id || !who) return res.status(402).json({error:'id or who is missing.'})

  const operation = like ? { "$push":{ "who_likes": who }}:{"$pull":{ "who_likes": who }}

  Post
  .findByIdAndUpdate(
    id,
    operation,
    { upsert: true, new: true }
  )
  .populate({path: 'author', select: 'profile.auth.nickname'})
  .populate({path: 'comments.author', select: 'profile.auth.nickname'})
  .exec((err, post) => {
    if (err) return next(err)
    return res.json(post)
  })
}


const deletePost = function (req, res, next) {
  const {id} = req.params

  if (id) {
    Post
      .findByIdAndRemove(id)
      .exec((err, post) => {
        if (err) return next(err)
        res.json(post)
      })

  }
}

module.exports = {
getPostById,
getPostsByUserId,
getPostsByTitle,
createPost,
deletePost,
getPosts,
commentPost,
likePost,
}