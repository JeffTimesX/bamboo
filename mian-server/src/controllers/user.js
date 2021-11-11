// user-controller
const { DateTime } = require('luxon')
const axios = require('axios')

const User = require('../models/user')
const Post = require('../models/post')

// getWatches()
const getWatches = async function (req, res, next) {
  if(!req.params || !req.params.sub){
    return res.json({error: "invalid input format."})
  } 
  const { sub } = req.params
  
  let filter={}
  if ( sub.includes('auth0|')) {
    filter = { "profile.auth.sub": sub } 
  }else{
    filter = { _id: sub }  
  }

  console.log("getWatches() for user: ", sub)
  
  User
    .findOne(
      filter //{ "profile.auth.sub": sub }
    )
    .exec(function (err, user){
      if(err) return next(err)
      if(!user) {
        console.log('user not found.')
        return res.json({error: 'user not found.'}) 
      }
      console.log('returned user\'s watches: ', user.watches)
      return res.json(user.watches)
    })
}

function updateWatches(req, res, next){
  if(!req.params || !req.params.sub || 
    !req.body  || !req.body.watches){
    return res.json({error: "invalid input format."})
  } 

  const { sub } = req.params
  const { watches } = req.body
  console.log("sub: ", sub, )
  console.log("watches: ", watches)

  let filter={}
  if ( sub.includes('auth0|')) {
    filter = { "profile.auth.sub": sub } 
  }else{
    filter = { _id: sub }  
  }

  console.log("updateWatches() received sub or _id: ", sub)

  User
    .findOneAndUpdate(
      filter, //{ "profile.auth.sub": sub },
      { "$set": { "watches": watches }},
      { upsert: true , new: true }
    )
    .exec(function (err, user){
      if(err) return next(err)
      return res.json(user.watches)
    })
}

const getPosts = function (req, res, next) {

  if(!req.params || !req.params.userId){
    return res.json({error: "invalid input format."})
  } 
  const { userId } = req.params

  let filter={}
  if ( userId.includes('auth0|')) {
    filter = { "profile.auth.sub": userId } 
  }else{
    filter = { _id: userId } 
  }
  
  console.log("getPost() for user: ", sub)

  User
    .findById(filter)
    .populate({path: "posts"})
    .exec((err, user) => {
      if(err) return next(err)
      return res.json(user)
    })
}

const deleteUserById = function (req, res, next){
  if(!req.params || !req.params.id){
    return res.json({error: "invalid input format."})
  } 
  const { id } = req.params

  let filter={}
  if ( id.includes('auth0|')) {
    filter = { "profile.auth.sub": id } 
  }else{
    filter = { _id: id }
  }

  console.log("deleteUserById(): ", sub)

  User
    .findOneAndDelete(filter)
    .exec((err, user)=>{
      if(err) return next(err)
      return res.json(user)
    })
}

// GET /user/user/:sub
const getUserBySub = function (req, res, next) {

  if(!req.params || !req.params.sub){
    return res.json({error: "invalid input format."})
  } 
  const { sub } = req.params
  let filter={}
  if ( sub.includes('auth0|')) {
    filter = { "profile.auth.sub": sub } 
  }else{
    filter = { _id: sub }
  }

  console.log("getUserBySub(): ", filter)

  User
    .findOne(filter)
    .populate('exchangeAccounts')
    .exec((err, user)=>{
      if (err) {
        console.log(err) 
        return res.json({error:err.message})
      }
      if(!user) {
        console.log('user not found.')
        return res.json({error: 'user not found.'}) 
      }
      console.log('getUserBySub returned user: ', user)
      return res.json(user)
    })
}

const updateUserBySub = function (req, res, next) {

  if(!req.params || !req.params.sub || 
    !req.body  || !req.body.profile || 
    !req.body.profile.auth){
      return res.json({error: "updateUserBySub() : user.profile.auth is missing."})
  } 

  const { sub } = req.params
  const user = req.body
  
  let filter={}
  if ( sub.includes('auth0|')) {
    filter = { "profile.auth.sub": sub } 
  }else{
    filter = { _id: sub }
  }

  if(user._id) delete user._id
  User
    .findOneAndUpdate(
      filter, 
      user,
      { "upsert": true, new: true }
    )
    .populate('exchangeAccounts')  
    .exec(function(err, user){
      if(err) {
        console.log(err)
        return next(err)
      }
      console.log('returned user: ', user)
      return res.json(user)
    })
}



module.exports = {
  getWatches,
  updateWatches,

  getPosts,

  getUserBySub,
  updateUserBySub,
  deleteUserById,
}