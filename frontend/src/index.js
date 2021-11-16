import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom'

import { Auth0ProviderWithHistory } from './auth'
import { UserProfileProvider } from './contexts'

import 'bootstrap/dist/css/bootstrap.min.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL 
  
const stockApiUrl = process.env.REACT_APP_STOCK_API_URL

ReactDOM.render(
  <React.StrictMode>
    
    <Router>
      <Auth0ProviderWithHistory>
        <UserProfileProvider 
          backendUrl={backendUrl}
          stockApiUrl={stockApiUrl}
        >
          <App />
        </UserProfileProvider>
      </Auth0ProviderWithHistory>
    </Router>

  </React.StrictMode>,
  document.getElementById('root')
);


