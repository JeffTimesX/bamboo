import React, { useContext } from 'react';

import { Container } from 'react-bootstrap';

import { 
  Switch, 
  Route } 
  from 'react-router-dom'

import { 
  AppFooter,
  Loading,
  NavBar, 
  ProtectedRoute,
} from './components';

import { 
  Home, 
  Portfolio,
  Profile, 
  Watches,
  WrapperTickerDetail,
  PaymentResponse,
  Post,
} from './views';

import { 
  UserProfileContext 
} from './contexts'

import {useAuth0} from '@auth0/auth0-react'

import  {AfterAuthorization} from './auth'


export default function App() {

  const {isProfileLoaded} = useContext(UserProfileContext)
  const {isAuthenticated} = useAuth0()

  
  // console.log('App() checking isAuthorized: ', isAuthenticated)
  // console.log('App() checking isProfileLoading: ', isProfileLoading)
  // console.log('App() checking isProfileLoaded: ', isProfileLoaded)


  return (!isAuthenticated || isProfileLoaded) ? (
    <div className="d-flex flex-column bg-light " >
      <NavBar />
      <Container className="w-75">
        <div className="mt-3 pe-1 ps-1">
          <Switch>
            <Route path="/" exact component={ Home } />
            <ProtectedRoute path="/portfolio" component={ Portfolio } />
            <ProtectedRoute path="/watches" component={ Watches } />
            <ProtectedRoute path="/profile" component={ Profile } />
            <Route path="/ticker-detail/:ticker" component={ WrapperTickerDetail } />
            <ProtectedRoute path="/authorized" component={ AfterAuthorization } />
            <ProtectedRoute path='/post' component={ Post } />
            <Route path='/payment/returned/:status' component={ PaymentResponse } />
          </Switch>
        </div>
      </Container>
      <AppFooter />
    </div>
  ):(
    <Loading />
  )
}