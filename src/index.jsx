/* eslint-disable prettier/prettier */
import { ColorModeScript } from '@chakra-ui/react';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';

import { App } from './App';
import { IS_LOCAL, IS_PROD, IS_STAGENET } from './settings/config'


const container = document.getElementById('root');
const root = createRoot(container);
const renderApp = () => {
  root.render(
    <StrictMode>
      <ColorModeScript />
      <App />
    </StrictMode>
  );
};

const checkAppRender = () => {
  if (IS_LOCAL || IS_STAGENET || IS_PROD) {
    renderApp();
  } else {
    const pagePassword =
      localStorage.getItem('pagePassword') ||
      prompt('Please enter the password to access this page');
    localStorage.setItem('pagePassword', pagePassword);

    const decodedPass = hmacSHA512(pagePassword, 'I!(G#s@1ADgjAlcSW!@()GF#(!@')
      .toString()
      .slice(-10);

    /**
     * Replace with new password hash generated from command line.
     */
    const currentPasswordHash = '64127a68bc';
    if (decodedPass === currentPasswordHash) {
      renderApp();
    } else {
      localStorage.setItem('pagePassword', '');
      alert('Incorrect password');
      setTimeout(() => window.location.reload(), 500);
    }
  }
};

checkAppRender();
