import { Midgard } from '@thorswap-lib/midgard-sdk';
import { Network } from '@thorswap-lib/types';
import { IS_STAGENET, MIDGARD_URL } from 'settings/config';

export const midgardSdk = new Midgard({
  network: IS_STAGENET ? 'stagenet' : Network.Mainnet,
  url: MIDGARD_URL,
});
