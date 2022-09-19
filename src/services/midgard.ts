import { Midgard } from '@thorswap-lib/midgard-sdk';
import { IS_STAGENET, MIDGARD_URL, NETWORK } from 'settings/config';

export const midgardApi = new Midgard({
  network: IS_STAGENET ? 'stagenet' : NETWORK,
  url: MIDGARD_URL,
});
