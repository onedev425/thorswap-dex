import { PhantomClient } from '@thorswap-lib/multichain-web-extensions';
import { NETWORK } from 'settings/config';

const phantom = new PhantomClient(NETWORK);

export { phantom };
