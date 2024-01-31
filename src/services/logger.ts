import * as Sentry from '@sentry/react';
import posthog from 'posthog-js';
import { IS_BETA, IS_DEV_API, IS_LOCAL, IS_PROD, IS_STAGENET } from 'settings/config';

const posthogKey = import.meta.env.VITE_POSTHOG_API_KEY || process.env.VITE_POSTHOG_API_KEY;
const posthogEnabled = posthogKey && (IS_PROD || IS_BETA);
const sentryEnabled = !IS_LOCAL;

export function initialiseLogger() {
  if (IS_LOCAL) return;

  if (posthogEnabled) {
    posthog.init(posthogKey, {
      api_host: 'https://eu.posthog.com',
      autocapture: false,
      capture_pageleave: true,
      capture_pageview: true,
      capture_performance: true,
      disable_cookie: true,
    });

    posthog.startSessionRecording();
  }

  if (sentryEnabled) {
    Sentry.init({
      debug: process.env.NODE_ENV === 'development',
      dsn: 'https://1f5f80292ace104d2e844cba267a8abb@o4505861490868224.ingest.sentry.io/4505861499781120',
      enabled: sentryEnabled,
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
}

export const logEvent = async (event: string, properties?: Record<string, any>) => {
  if (!posthogEnabled) return;

  posthog.capture(event, properties);
};

export const logException = async (error: Error, properties?: Record<string, any>) => {
  if (!sentryEnabled) return;

  Sentry.captureException(error, properties);
};

export const identifyUser = async (id: string, properties?: Record<string, any>) => {
  if (posthogEnabled) {
    posthog.identify(id, properties);
  }

  if (sentryEnabled) {
    Sentry.setUser({ id, ...properties });
  }
};
