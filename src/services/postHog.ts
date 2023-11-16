import posthog from 'posthog-js';
import { IS_BETA, IS_PROD } from 'settings/config';

const posthogKey = import.meta.env.VITE_POSTHOG_API_KEY || process.env.VITE_POSTHOG_API_KEY;
const posthogEnabled = posthogKey && (IS_PROD || IS_BETA);

const initPosthog = () => {
  if (!posthogEnabled) return;
  posthog.init(posthogKey, {
    api_host: 'https://eu.posthog.com',
    autocapture: false,
    capture_pageleave: true,
    capture_pageview: true,
    capture_performance: true,
    disable_cookie: true,
  });

  posthog.startSessionRecording();
};

initPosthog();
export const captureEvent = async (event: string, properties?: Record<string, any>) => {
  if (!posthogEnabled) return;

  posthog.capture(event, properties);
};
