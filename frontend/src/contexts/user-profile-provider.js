import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useAuth0} from '@auth0/auth0-react';
import { UserProfileContext } from '../contexts';
import { Loading } from '../components';
import { DateTime } from 'luxon'


export default function UserProfileProvider({ backendUrl, children }) {

  // authProfile could be undefined if the user is not logged in.
  const { user:authProfile, isAuthenticated, getAccessTokenSilently } = useAuth0()
  
  // path configurations
  const UserProfileEndPoint = backendUrl + '/user/profile/'
  const UserEndPoint = backendUrl + '/user/user/'
  
  // initializing user profile with only the auth part.
  const initUserProfile = {
    profile: { 
      auth: authProfile,
    }
  }

  // user profile state will be enclosed in the context.
  const [userProfile, setUserProfile] = useState(initUserProfile)

  // indicator to postpone the renders of components to wait the profile loading.
  const [isProfileLoading, setIsProfileLoading] = useState(false)

  // to be moved in to Profile component, updates the change within the Profile component,
  // only updates the userProfile back to the context, that avoid page rerendered.
  async function updateProfileExt(extProfile){
    console.log('extProfile passed to UserProfileContext: ', extProfile)
    const token = await getAccessTokenSilently()
    const updateUserProfile = {
      ...userProfile,
      profile: {
        auth: userProfile.profile.auth,
        ext: extProfile,
      }
    }
    const response = await axios
      .post(process.env.REACT_APP_BACKEND_URL + '/user/profile/' + userProfile.profile.auth.sub, 
        updateUserProfile, 
        { headers: { Authorization: `Bearer ${token}` } }
      )
    const updatedUserProfile = response.data
    setUserProfile(updatedUserProfile)
  }




  async function addToWatches(ticker){    
    if ( userProfile.watches.filter((watch) => watch.ticker === ticker)[0]) return
    const updateWatches = [...userProfile.watches]
    updateWatches.push({ticker: ticker, watched_at:DateTime.now().toISO()})
    const token = await getAccessTokenSilently()
    const response = await axios
      .post(process.env.REACT_APP_BACKEND_URL + '/user/watches/' + userProfile.profile.auth.sub, 
        { watches: updateWatches }, 
        { headers: { Authorization: `Bearer ${token}` } }
      )
    const updatedWatches = response.data
    setUserProfile({
      ...userProfile,
      watches: updatedWatches
    })
  }



// if it is the first time the user signed in, populate the ext profile part with a framework.
async function completeUserProfileForSignup(user, token){
  if(user && user.profile && user.profile.ext) return {...user}
  const transUser = {
    ...user,
    profile:{
      ...user.profile,
      ext: {
        first_name: '',
        last_name: '',
        gender: '',
        date_of_birth: '2000-01-01',
        occupation: ''
      }
    }
  }
  const url = UserEndPoint + transUser.profile.auth.sub
  const res = await axios.post(
    url, 
    transUser,
    { headers: { Authorization: `Bearer ${token}` }}
  )
  const finalReturnedUserProfile = res.data
  
  console.log("2nd update finalReturned: ", finalReturnedUserProfile)
  
  return finalReturnedUserProfile
  
}



// receives an user profile, sends it to the backend server to update
// corresponding document and returns the full updated profile document.
async function updateUserProfile(user){

  if(!isAuthenticated || !user || !user.profile || !user.profile.auth || !user.profile.auth.sub ) {
    console.log("error: user does not login, nothing to update.")
    return
  }
  const token = await getAccessTokenSilently()

  const url = UserProfileEndPoint + user.profile.auth.sub
  
  const firstCheck = await axios.get(
    url, 
    user,
    { headers: { Authorization: `Bearer ${token}` }}
  )
  let checkReturnedUserProfile = firstCheck.data

  console.log('first check: ', checkReturnedUserProfile)
  
  // the first time user does not exit in backend server, create it with auth. 
  if(checkReturnedUserProfile.message !== undefined) {
    checkReturnedUserProfile = user
  }

  const completedUserProfile = await completeUserProfileForSignup(checkReturnedUserProfile, token)
  
  console.log("update profile successfully, returned completed user profile: ", completedUserProfile)
  
  setUserProfile(completedUserProfile)
  setIsProfileLoading(false)
  
  return completedUserProfile

}

async function addToPortfolio(ticker, amount){
  const updatePortfolio = [...userProfile.portfolio]
  const existed = updatePortfolio.filter(item => item.ticker === ticker)
  if(existed[0]){
    const newOne = {...existed[0], inventory: existed[0].inventory + amount, purchased_at: DateTime.now().toISO() }
    updatePortfolio.pop(existed[0])
    updatePortfolio.push(newOne) 
  }else{
    updatePortfolio.push({ticker: ticker, inventory: amount, purchased_at: DateTime.now().toISO()})
  }
  const token = await getAccessTokenSilently()
  const response = await axios
    .post(process.env.REACT_APP_BACKEND_URL + '/user/portfolio/' + userProfile.profile.auth.sub, 
      { portfolio: updatePortfolio }, 
      { headers: { Authorization: `Bearer ${token}` } }
    )
  const updatedPortfolio = response.data
  // console.log('updatedPortfolio: ', updatedPortfolio)
  setUserProfile({
    ...userProfile,
    portfolio: updatedPortfolio
  })
  
}

const contextValue = {
    userProfile,
    setUserProfile,
    isProfileLoading,
    setIsProfileLoading,
    updateProfileExt,
    addToWatches,
    addToPortfolio,
    updateUserProfile,

  }




  return isProfileLoading ? (
    <Loading />
    ) : (
    <UserProfileContext.Provider value={contextValue}>
      {children}
    </UserProfileContext.Provider>
  )
}