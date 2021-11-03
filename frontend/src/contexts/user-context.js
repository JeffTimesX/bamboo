import React from 'react'


const UserProfileContext = React.createContext({
  
  userProfile: {},
  isProfileChanged: false,
  isProfileLoading: false,
  setIsProfileLoading: ()=>{},
  setIsProfileChanged: () =>{},
  updateProfileExt: ()=> {},
  addToPortfolio: (ticker) => {},
  // deleteFromPortfolio: (ticker) => {},
  addToWatches: (ticker) =>{},
  setUserProfile: (profile) => {},
  updateUserProfile: (profile) =>{},

  // deleteFromWatches: (ticker) =>{},
  // addToExchangeAccounts: (account) => {},
  // deleteFromExchangeAccounts: (account) => {},
  // addToPaymentAccounts: (account) => {},
  // deleteFromPaymentAccounts:() =>{},

})

export default UserProfileContext