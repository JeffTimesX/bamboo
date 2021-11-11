import React from 'react'


const UserProfileContext = React.createContext({
  
  userProfile: {},
  setUserProfile: (profile) => {},
  updateUserProfile: (profile) =>{},
  updateProfileExt: ()=> {},

  isProfileLoading: false,
  setIsProfileLoading: ()=>{},
  
  addToWatches: (ticker) =>{},
  removeFromWatches: (ticker) =>{},
  
  updateExchangeAccounts: (exchangeAccounts) =>{},

  getTickerCurrentPrice: (ticker) => {},
  
  populatePortfolioWithPriceAndValue: (portfolio) => {},

  dealTickerAndUpdateUserProfile: (transaction) => {}, 

  getAggregateBySymbolAndInterval: (symbol, interval) => {},

})

export default UserProfileContext