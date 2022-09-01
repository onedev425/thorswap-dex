import { Midgard } from '@thorswap-lib/midgard-sdk';
import {
  IS_DEV_API,
  IS_PROD,
  IS_STAGENET,
  MIDGARD_STAGENET_API,
  MIDGARD_URL,
  NETWORK,
} from 'settings/config';

const baseUrl = IS_DEV_API
  ? MIDGARD_STAGENET_API
  : IS_PROD
  ? import.meta.env.VITE_MAINNET_MIDGARD
  : MIDGARD_URL;

export const midgardApi = new Midgard({
  network: IS_STAGENET ? 'stagenet' : NETWORK,
  url: baseUrl,
});
