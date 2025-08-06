import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/styles/App.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="20786630960-har0v36ebgmre50qjvgg4gg95109emo7.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
