import { type SwapKitCore as SwapKitCoreType } from '@swapkit/core';
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
  const { SwapKitCore } = await import('@swapkit/core');
  const { evmWallet } = await import('@swapkit/wallet-evm-extensions');
  const { keplrWallet } = await import('@swapkit/wallet-keplr');
  const { keystoreWallet } = await import('@swapkit/wallet-keystore');
  const { ledgerWallet } = await import('@swapkit/wallet-ledger');
  const { okxWallet } = await import('@swapkit/wallet-okx');
  const { trezorWallet } = await import('@swapkit/wallet-trezor');
  const { walletconnectWallet } = await import('@swapkit/wallet-wc');
  const { xdefiWallet } = await import('@swapkit/wallet-xdefi');

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
      evmWallet,
      keplrWallet,
      keystoreWallet,
      ledgerWallet,
      okxWallet,
      trezorWallet,
      walletconnectWallet,
      xdefiWallet,
    ],
  });

  sdkClient = core;

  return sdkClient;
};
