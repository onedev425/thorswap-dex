import { IS_DEV_API, IS_STAGENET } from 'settings/config';

export function getBaseUrl() {
  if (IS_STAGENET) {
    return 'https://api-stagenet.thorswap.net';
  }

  if (IS_DEV_API) {
    return 'https://dev-api.thorswap.net';
  }

  return 'https://api.thorswap.net';
}
