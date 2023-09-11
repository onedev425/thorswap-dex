/* eslint-disable prettier/prettier */
import { ColorModeScript } from '@chakra-ui/react';
import * as Sentry from "@sentry/react";
import hmacSHA512 from 'crypto-js/hmac-sha512';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';

import { App } from './App';
import { IS_BETA, IS_DEV_API, IS_LOCAL, IS_PROD, IS_STAGENET } from './settings/config'

Sentry.init({
  dsn: "https://1f5f80292ace104d2e844cba267a8abb@o4505861490868224.ingest.sentry.io/4505861499781120",
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ["localhost", /^https:\/\/\*\.thorswap\.net/],
    }),
    new Sentry.Replay(),
  ],
  tracesSampleRate: IS_LOCAL ? 1.0 : 0.05,
  tracePropagationTargets: ["localhost", /^https:\/\/\*\.thorswap\.net/],

  environment: IS_PROD ? 'production' : IS_BETA ? 'beta' : IS_STAGENET ? 'stagenet' : IS_DEV_API ? 'dev-api' : 'development',
  debug: false,
});


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
