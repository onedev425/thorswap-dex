import { type SwapKitCore as SwapKitCoreType } from '@thorswap-lib/swapkit-core';
import { IS_STAGENET, MIDGARD_URL } from 'settings/config';

let sdkClient: SwapKitCoreType;

const covalentApiKey = import.meta.env.VITE_COVALENT_API_KEY || process.env.VITE_COVALENT_API_KEY;
const utxoApiKey = import.meta.env.VITE_BLOCKCHAIR_API_KEY || process.env.VITE_BLOCKCHAIR_API_KEY;
const ethplorerApiKey =
  import.meta.env.VITE_ETHPLORER_API_KEY || process.env.VITE_ETHPLORER_API_KEY;

export const getSwapKitClient = async () => {
  if (sdkClient) return sdkClient;
  const { SwapKitCore } = await import('@thorswap-lib/swapkit-core');
  const { keystoreWallet } = await import('@thorswap-lib/keystore');
  const { ledgerWallet } = await import('@thorswap-lib/ledger');
  const { walletconnectWallet } = await import('@thorswap-lib/walletconnect');
  const { evmWallet, keplrWallet, xdefiWallet } = await import('@thorswap-lib/web-extensions');

  const core = new SwapKitCore({ midgardUrl: MIDGARD_URL, stagenet: IS_STAGENET });

  core.extend({
    config: { covalentApiKey, ethplorerApiKey, utxoApiKey, stagenet: IS_STAGENET },
    wallets: [
      keystoreWallet,
      ledgerWallet,
      walletconnectWallet,
      evmWallet,
      keplrWallet,
      xdefiWallet,
    ],
  });
  sdkClient = core;

  return sdkClient;
};
