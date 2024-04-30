import * as Sentry from '@sentry/react';
import posthog from 'posthog-js';
import { IS_BETA, IS_DEV_API, IS_LOCAL, IS_PROD, IS_STAGENET } from 'settings/config';

const posthogKey = import.meta.env.VITE_POSTHOG_API_KEY || process.env.VITE_POSTHOG_API_KEY;
const posthogEnabled = false; // posthogKey && (IS_PROD || IS_BETA);
const sentryEnabled = !IS_LOCAL;

export function initialiseLogger() {
  if (IS_LOCAL) return;

  if (posthogEnabled) {
    posthog.init(posthogKey, {
      api_host: 'https://eu.posthog.com',
      autocapture: false,
      capture_performance: true,
      disable_persistence: true,
    });

    posthog.startSessionRecording({});
  }

  if (sentryEnabled) {
    Sentry.init({
      debug: process.env.NODE_ENV === 'development',
      dsn: 'https://1f5f80292ace104d2e844cba267a8abb@o4505861490868224.ingest.sentry.io/4505861499781120',
      enabled: sentryEnabled,
      integrations: [Sentry.replayIntegration()],
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

export const logEvent = async (event: string, properties?: Record<string, Todo>) => {
  if (!posthogEnabled) {
    !IS_PROD && console.info('Event:', event, properties);
  }

  posthog.capture(event, properties);
};

/**
 * some of them are todo for now, some we should skip as they are user related
 */
const skippedPatterns = [
  '_wallet_',
  'failed to execute',
  'invalid password',
  'ledger device',
  'provider is not defined',
  'user rejected',
  'failed to fetch',
  'core_',
];
export const logException = async (error: Error | string, properties?: Record<string, Todo>) => {
  const errorMessage = (typeof error === 'string' ? error : error.toString()).toLowerCase();

  if (skippedPatterns.some((pattern) => errorMessage.includes(pattern.toLowerCase()))) {
    return;
  }

  if (!sentryEnabled) return console.error(error);

  Sentry.captureException(error, properties);
};

export const identifyUser = async (id: string, properties?: Record<string, Todo>) => {
  if (posthogEnabled) {
    posthog.identify(id, properties);
  }

  if (sentryEnabled) {
    Sentry.setUser({ id, ...properties });
  }
};
