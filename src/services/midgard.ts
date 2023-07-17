import { Midgard } from '@thorswap-lib/midgard-sdk';
import { IS_STAGENET, MIDGARD_URL } from 'settings/config';

export const midgardSdk = new Midgard({
  network: IS_STAGENET ? 'stagenet' : 'mainnet',
  url: MIDGARD_URL,
});
