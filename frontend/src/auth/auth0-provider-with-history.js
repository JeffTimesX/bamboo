import React from 'react';

// useHistory is a hook which providers by react-router-dom module.
// 
import { useHistory } from 'react-router-dom';

// Auth0provider is a useContext Hook, it use an auth0Context hook which defined in
// the @auth0/auth0-react module.
import { Auth0Provider } from '@auth0/auth0-react';


// It is a wrapper to inject the history Hook into the Auth0Provider.
// It create the history Context and pass a callback function to the Auth0Provider.
// The callback function will be called to push new item into the history context 
// when there is an redirect event happened within the Auth0Provider scope.
const Auth0ProviderWithHistory = ({ children }) => {
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
  const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

  const history = useHistory();

  const onRedirectCallback = (appState) => {
    history.push(appState?.returnTo || window.location.pathname);
  };

  const url = 'http://localhost:' + process.env.REACT_APP_PORT + '/authorized'
  // console.log('url: ', url)
  
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={url} //{window.location.origin}
      onRedirectCallback={onRedirectCallback}
      audience={audience}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
