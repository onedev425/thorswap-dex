import { type SwapKitCore as SwapKitCoreType } from '@thorswap-lib/swapkit-core';
import { IS_STAGENET } from 'settings/config';

let sdkClient: SwapKitCoreType;

const covalentApiKey = import.meta.env.VITE_COVALENT_API_KEY || process.env.VITE_COVALENT_API_KEY;
const utxoApiKey = import.meta.env.VITE_BLOCKCHAIR_API_KEY || process.env.VITE_BLOCKCHAIR_API_KEY;
const ethplorerApiKey =
  import.meta.env.VITE_ETHPLORER_API_KEY || process.env.VITE_ETHPLORER_API_KEY;
const walletConnectProjectId =
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || process.env.VITE_WALLETCONNECT_PROJECT_ID;

export const getSwapKitClient = async () => {
  if (sdkClient) return sdkClient;
  const { SwapKitCore } = await import('@thorswap-lib/swapkit-core');
  const { keystoreWallet } = await import('@thorswap-lib/keystore');
  const { ledgerWallet } = await import('@thorswap-lib/ledger');
  const { trezorWallet } = await import('@thorswap-lib/trezor');
  const { walletconnectWallet } = await import('@thorswap-lib/walletconnect');
  const { trustwalletWallet } = await import('@thorswap-lib/trustwallet');
  const { xdefiWallet } = await import('@thorswap-lib/xdefi');
  const { keplrWallet } = await import('@thorswap-lib/keplr');
  const { evmWallet } = await import('@thorswap-lib/evm-web3-wallets');

  const core = new SwapKitCore({ stagenet: IS_STAGENET });

  core.extend({
    config: {
      walletConnectProjectId,
      covalentApiKey,
      ethplorerApiKey,
      utxoApiKey,
      stagenet: IS_STAGENET,
    },
    wallets: [
      keystoreWallet,
      ledgerWallet,
      trezorWallet,
      trustwalletWallet,
      walletconnectWallet,
      evmWallet,
      keplrWallet,
      xdefiWallet,
    ],
  });
  sdkClient = core;

  return sdkClient;
};
