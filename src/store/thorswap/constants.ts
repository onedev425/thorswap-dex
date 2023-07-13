import { IS_DEV_API } from 'settings/config';

const DEV_URL = 'https://dev-api.thorswap.net';
const PROD_URL = 'https://api.thorswap.net';

export const BASE_URL = IS_DEV_API ? DEV_URL : PROD_URL;
