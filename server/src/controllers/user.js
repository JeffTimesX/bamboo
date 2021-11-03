// user-controller
const { DateTime } = require('luxon')
const axios = require('axios')

const User = require('../models/user')
const Post = require('../models/post')

// getProfile()
const getProfile = async function (req, res, next) {
  
  if(!req.params || !req.params.sub){
    return res.json({message: "invalid input format."})
  } 
  
  const { sub } = req.params
  console.log("query user\'s sub: ", sub)
  User
    .findOne(
      { "profile.auth.sub": sub }
    )
    .exec(function (err, user){
      if(err) return next(err)
      if(!user) {
        console.log('user not found.')
        return res.json({message: 'user not found.'}) 
      }
      console.log('returned user\'s sub: ', user.profile.auth.sub)
      return res.json(user)
    })
}

// updateProfile()
const updateProfile = async function (req, res, next) {
  console.log(req.params)
  console.log(req.body)
  
  if(!req.params || !req.params.sub || 
    !req.body  || !req.body.profile || 
    !req.body.profile.auth){
      return res.json({message: "invalid input format."})
  } 

  const { sub } = req.params
  const { profile } = req.body
  if(sub !== profile.auth.sub) return next(new Error({message:'updating different sub is not allowed.'}))
  
  // extending profile exists, updates all profile.
  if(profile.ext) {
    User
      .findOneAndUpdate(
        { "profile.auth.sub": profile.auth.sub },
        { "$set": { "profile": profile }},
        { "upsert": true, new: true }

      ).exec(function(err, user){
        if(err) {
          console.log(err)
          return next(err)
        }
        console.log('returned profile: ', user)
        return res.json(user)
      })
  }else{  // otherwise updates profile.auth part only.
    User
      .findOneAndUpdate(
        { "profile.auth.sub": profile.auth.sub },
        { "$set": { "profile.auth": profile.auth }},
        { "upsert": true, new: true }
      )
      .exec(function (err, user){
        if(err) {
          console.log(err)
          return next(err)
        }
        console.log('returned profile: ', user)
        return res.json(user)
      })
  }
}


// getPortfolio()
const getPortfolio = async function (req, res, next) {

  if(!req.params || !req.params.sub){
  return res.json({message: "invalid input format."})
  } 
  const { sub } = req.params
  console.log("query user\'s sub: ", sub)
  User
    .findOne(
      { "profile.auth.sub": sub }
    )
    .exec(function (err, user){
      if(err) return next(err)
      if(!user) {
        console.log('user not found.')
        return res.json({message: 'user not found.'}) 
      }
      console.log('returned user\'s portfolio: ', user.portfolio)
      return res.json(user.portfolio)
    })

  }

  

// updatePortfolio()
function updatePortfolio(req, res, next){

  if(!req.params || !req.params.sub || 
      !req.body  || !req.body.portfolio){
        return res.json({message: "invalid input format."})
  } 
    
  const { sub } = req.params
  const { portfolio } = req.body
  console.log("sub: ", sub, )
  console.log("portfolio: ", portfolio)
  User
    .findOneAndUpdate(
      { "profile.auth.sub": sub },
      { "$set": { "portfolio": portfolio }},
      { upsert: true, new: true }
    )
    .exec(function (err, user){
      if(err) return next(err)
      return res.json(user.portfolio)
    })
}
// getWatches()
const getWatches = async function (req, res, next) {
  if(!req.params || !req.params.sub){
    return res.json({message: "invalid input format."})
  } 
  const { sub } = req.params
  console.log("query user\'s sub: ", sub)
  User
    .findOne(
      { "profile.auth.sub": sub }
    )
    .exec(function (err, user){
      if(err) return next(err)
      if(!user) {
        console.log('user not found.')
        return res.json({message: 'user not found.'}) 
      }
      console.log('returned user\'s watches: ', user.watches)
      return res.json(user.watches)
    })
}

function updateWatches(req, res, next){
  if(!req.params || !req.params.sub || 
    !req.body  || !req.body.watches){
    return res.json({message: "invalid input format."})
  } 
  const { sub } = req.params
  const { watches } = req.body
  console.log("sub: ", sub, )
  console.log("watches: ", watches)
  User
    .findOneAndUpdate(
      { "profile.auth.sub": sub },
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
    return res.json({message: "invalid input format."})
  } 
  const { userId } = req.params
  User
    .findById(userId)
    .populate({path: "posts"})
    .exec((err, user) => {
      if(err) return next(err)
      return res.json(user)
    })
}

const deleteUserById = function (req, res, next){
  if(!req.params || !req.params.id){
    return res.json({message: "invalid input format."})
  } 
  const { id } = req.params
  User
    .findByIdAndDelete(id)
    .exec((err, user)=>{
      if(err) return next(err)
      return res.json(user)
    })
}

const getUserBySub= function (req, res, next) {
  if(!req.params || !req.params.sub){
    return res.json({message: "invalid input format."})
  } 
  const { sub } = req.params
  User
    .findOne({ "profile.auth.sub": sub })
    .exec((err, user)=>{
      if (err ) {
        console.log(err) 
        return next(err)
      }
      console.log('returned user: ', user)
      return res.json(user)
    })
}

const updateUserBySub = function (req, res, next) {

  if(!req.params || !req.params.sub || 
    !req.body  || !req.body.profile || 
    !req.body.profile.auth){
      return res.json({message: "invalid input format."})
  } 

  const { sub } = req.params
  const user = req.body
  if(sub !== user.profile.auth.sub) {
    return next(new Error({message:'updating different sub is not allowed.'}))
  }
  if(user._id) delete user._id
  User
    .findOneAndUpdate(
      { "profile.auth.sub": user.profile.auth.sub },
      user,
      { "upsert": true, new: true }
    ).exec(function(err, user){
      if(err) {
        console.log(err)
        return next(err)
      }
      console.log('returned user: ', user)
      return res.json(user)
    })
}



module.exports = {
  getProfile,
  updateProfile,
  getPortfolio,
  updatePortfolio,
  getWatches,
  updateWatches,
  deleteUserById,
  getPosts,
  getUserBySub,
  updateUserBySub,
}