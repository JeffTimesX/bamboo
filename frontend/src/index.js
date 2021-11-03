import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom'

import { Auth0ProviderWithHistory } from './auth'
import { UserContext, UserProfileProvider } from './contexts'

import 'bootstrap/dist/css/bootstrap.min.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL 

ReactDOM.render(
  <React.StrictMode>
    
    <Router>
      <Auth0ProviderWithHistory>
        <UserProfileProvider backendUrl={backendUrl}>
          <App />
        </UserProfileProvider>
      </Auth0ProviderWithHistory>
    </Router>

  </React.StrictMode>,
  document.getElementById('root')
);


