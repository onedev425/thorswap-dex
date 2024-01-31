/* eslint-disable prettier/prettier */
import { ColorModeScript } from '@chakra-ui/react';
import * as Sentry from '@sentry/react';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';

import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { IS_BETA, IS_DEV_API, IS_LOCAL, IS_PROD, IS_STAGENET } from './settings/config';

if (!IS_LOCAL) {
  Sentry.init({
    debug: process.env.NODE_ENV === 'development',
    dsn: 'https://1f5f80292ace104d2e844cba267a8abb@o4505861490868224.ingest.sentry.io/4505861499781120',
    enabled: !IS_LOCAL,
    integrations: [new Sentry.Replay()],
    replaysSessionSampleRate: IS_BETA ? 1.0 : 0.05,
    tracePropagationTargets: ['api.thorswap.net', 'mu.thorswap.net'],
    tracesSampleRate: IS_BETA ? 1.0 : 0.05,
    environment: IS_PROD
      ? 'production'
      : IS_BETA
        ? 'beta'
        : IS_STAGENET
          ? 'stagenet'
          : IS_DEV_API
            ? 'dev-api'
            : 'development',
  });
}

const container = document.getElementById('root');
const root = createRoot(container);

const renderApp = () => {
  root.render(
    <StrictMode>
      <Sentry.ErrorBoundary fallback={(error) => <ErrorBoundary error={error} />}>
        <ColorModeScript />
        <App />
      </Sentry.ErrorBoundary>
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
    const currentPasswordHash = '8d2cd907fb';
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
