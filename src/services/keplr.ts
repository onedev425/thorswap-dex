import { KeplrClient } from '@thorswap-lib/multichain-web-extensions';
import { NETWORK } from 'settings/config';

const keplr = new KeplrClient(NETWORK);

export { keplr };
