// user-controller
const { DateTime } = require('luxon')
const axios = require('axios')

const User = require('../models/user')
const Post = require('../models/post')

// getProfile() , query either by _id or sub
const getProfile = async function (req, res, next) {
  
  if(!req.params || !req.params.sub){
    return res.json({message: "invalid input format."})
  } 
  
  const { sub } = req.params
  let filter={}
  if ( sub.includes('auth0|')) {
    filter = { "profile.auth.sub": sub } 
  }else{
    filter = { _id: sub }
  }
  
  User
    .findOne( filter )
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
      console.log(req.body, req.params)
      return res.json({message: "invalid input format."})
  } 

  const { sub } = req.params
  const { profile } = req.body
  // if(sub !== profile.auth.sub) return next(new Error({message:'updating different sub is not allowed.'}))
  
  let filter={}
  if ( sub.includes('auth0|')) {
    filter = { "profile.auth.sub": sub } 
  }else{
    filter = { _id: sub }
  }
  console.log("query with user\'s sub or _id: ", filter)

  // extending profile exists, updates all profile.
  if(profile.ext) {
    User
      .findOneAndUpdate(
        filter, //{ "profile.auth.sub": profile.auth.sub },
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
        filter, //{ "profile.auth.sub": profile.auth.sub },
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

  let filter={}
  if ( sub.includes('auth0|')) {
    filter = { "profile.auth.sub": sub } 
  }else{
    filter = { _id: sub }
  }
  console.log("query with user\'s sub or _id: ", filter)

  User
    .findOne(
      filter //{ "profile.auth.sub": sub }
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
  

  let filter={}
  if ( sub.includes('auth0|')) {
    filter = { "profile.auth.sub": sub } 
  }else{
    filter = { _id: sub }
  }

  console.log("query with user\'s sub or _id: ", filter)
  console.log("portfolio: ", portfolio)

  User
    .findOneAndUpdate(
      filter, //{ "profile.auth.sub": sub },
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
  

  let filter={}
  if ( sub.includes('auth0|')) {
    filter = { "profile.auth.sub": sub } 
  }else{
    filter = { _id: sub }  
  }

  console.log("query user\'s sub or _id: ", sub)
  
  User
    .findOne(
      filter //{ "profile.auth.sub": sub }
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

  let filter={}
  if ( sub.includes('auth0|')) {
    filter = { "profile.auth.sub": sub } 
  }else{
    filter = { _id: sub }  
  }

  console.log("query user\'s sub or _id: ", sub)

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
    return res.json({message: "invalid input format."})
  } 
  const { userId } = req.params

  let filter={}
  if ( userId.includes('auth0|')) {
    filter = { "profile.auth.sub": userId } 
  }else{
    filter = { _id: userId } 
  }
  
  console.log("query user\'s sub or _id: ", sub)

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
    return res.json({message: "invalid input format."})
  } 
  const { id } = req.params

  let filter={}
  if ( id.includes('auth0|')) {
    filter = { "profile.auth.sub": id } 
  }else{
    filter = { _id: id }
  }

  console.log("query user\'s sub or _id: ", sub)

  User
    .findOneAndDelete(filter)
    .exec((err, user)=>{
      if(err) return next(err)
      return res.json(user)
    })
}

const getUserBySub = function (req, res, next) {
  if(!req.params || !req.params.sub){
    return res.json({message: "invalid input format."})
  } 
  const { sub } = req.params
  let filter={}
  if ( sub.includes('auth0|')) {
    filter = { "profile.auth.sub": sub } 
  }else{
    filter = { _id: sub }
  }

  console.log("query with user\'s sub or _id: ", filter)

  User
    .findOne(filter)
    .populate('exchangeAccounts')
    .exec((err, user)=>{
      if (err ) {
        console.log(err) 
        return next(err)
      }
      if(!user) {
        console.log('user not found.')
        return res.json({message: 'user not found.'}) 
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
  //if(sub !== user.profile.auth.sub) {
  //  return next(new Error({message:'updating different sub is not allowed.'}))
  //}
  
  let filter={}
  if ( sub.includes('auth0|')) {
    filter = { "profile.auth.sub": sub } 
  }else{
    filter = { _id: sub }
  }

  if(user._id) delete user._id
  User
    .findOneAndUpdate(
      filter, //{ "profile.auth.sub": user.profile.auth.sub },
      user,
      { "upsert": true, new: true }
    )
    .populate('exchangeAccounts')  // I am not sure the populate() works with findOneAndUpdate() or not.
    // .populate('paymentAccounts')
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