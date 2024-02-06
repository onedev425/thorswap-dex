import { mergeConfig } from 'vite';

import baseConfig from './vite.config';

// @ts-expect-error
export default mergeConfig(baseConfig, {
  root: 'ledgerLive',
  define: {
    'process.env': {
      VITE_LEDGER_LIVE: 'true',
    },
  },
});
