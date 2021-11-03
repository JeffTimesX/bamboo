import React, { useContext, useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Switch, Route } from 'react-router-dom'
import { NavBar, ProtectedRoute, Loading } from './components';
import { Home, Profile, WrapperTickerDetail, } from './views';
import { UserProfileContext } from './contexts'
import { useAuth0 } from '@auth0/auth0-react'

import  {AfterAuthorization} from './auth'



export default function App() {

  const { isLoading, isAuthenticated, user: auth } = useAuth0();
  const { userProfile, updateUserProfile, setIsProfileLoading } = useContext(UserProfileContext);

  console.log("isAuthenticated in App(): ", isAuthenticated)
  console.log('profile context in App(): ', userProfile)
  console.log('isLoading: ', isLoading)
// initialize the user profile context if customer logged in.

useEffect(() => {

  if(isAuthenticated) {
    //setIsProfileLoading(true)   // I need a flag to indicate the profile page waiting for it to render. but it makes an infinite looping.
    updateUserProfile({profile:{auth:auth}})
  }
},[isAuthenticated])


if (isLoading) { // isProfileLoading should be added to the conditions.
  return <Loading />;
}

  return (
      <div className="d-flex flex-column mh-100 bg-secondary pb-5" >
        <NavBar />
        <Container >
          <div className="mt-3 pe-1 ps-1">
            <Switch>
              <Route path="/" exact component= {Home} />
              <Route path="/portfolio" component= {NavBar} />
              <Route path="/watches" component= {NavBar} />
              <ProtectedRoute path="/profile" component= {Profile} />
              <Route path="/ticker-detail/:ticker" component={ WrapperTickerDetail } />
              <ProtectedRoute path="/authorized" component={AfterAuthorization} />
            </Switch>
          </div>
        </Container>
      </div>
    
  )
}