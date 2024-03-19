import type { ChainflipProvider } from '@swapkit/chainflip';
import type { ConnectWalletParams, SwapKit } from '@swapkit/core';
import type { ThorchainProvider } from '@swapkit/thorchain';
import type { evmWallet } from '@swapkit/wallet-evm-extensions';
import type { keepkeyWallet } from '@swapkit/wallet-keepkey';
import type { keplrWallet } from '@swapkit/wallet-keplr';
import type { keystoreWallet } from '@swapkit/wallet-keystore';
import type { ledgerWallet } from '@swapkit/wallet-ledger';
import type { okxWallet } from '@swapkit/wallet-okx';
import type { trezorWallet } from '@swapkit/wallet-trezor';
import type { walletconnectWallet } from '@swapkit/wallet-wc';
import type { xdefiWallet } from '@swapkit/wallet-xdefi';
import { IS_LOCAL, IS_STAGENET } from 'settings/config';

type supportedWallet =
  | typeof evmWallet
  | typeof keplrWallet
  | typeof keystoreWallet
  | typeof keepkeyWallet
  | typeof ledgerWallet
  | typeof okxWallet
  | typeof trezorWallet
  | typeof walletconnectWallet
  | typeof xdefiWallet;

type ConnectWalletType = {
  [P in supportedWallet['connectMethodName']]: ReturnType<
    (params: ConnectWalletParams) => (connectParams: any) => string | undefined
  >;
};

export type SwapKitReturnType = ReturnType<
  typeof SwapKit<
    {
      thorchain: ReturnType<typeof ThorchainProvider>['methods'];
      chainflip: ReturnType<typeof ChainflipProvider>['methods'];
    },
    ConnectWalletType
  >
>;

let sdkClient: SwapKitReturnType;

export const getSwapKitClient = async () => {
  if (sdkClient) return sdkClient;
  const { SwapKit } = await import('@swapkit/core');
  const { evmWallet } = await import('@swapkit/wallet-evm-extensions');
  const { keplrWallet } = await import('@swapkit/wallet-keplr');
  const { keystoreWallet } = await import('@swapkit/wallet-keystore');
  const { keepkeyWallet } = await import('@swapkit/wallet-keepkey');
  const { ledgerWallet } = await import('@swapkit/wallet-ledger');
  const { okxWallet } = await import('@swapkit/wallet-okx');
  const { trezorWallet } = await import('@swapkit/wallet-trezor');
  const { walletconnectWallet } = await import('@swapkit/wallet-wc');
  const { xdefiWallet } = await import('@swapkit/wallet-xdefi');
  const { ThorchainProvider } = await import('@swapkit/thorchain');
  const { ChainflipProvider } = await import('@swapkit/chainflip');

  const supportedWallets = [
    evmWallet,
    keplrWallet,
    keystoreWallet,
    keepkeyWallet,
    ledgerWallet,
    okxWallet,
    trezorWallet,
    walletconnectWallet,
    xdefiWallet,
  ];

  const core = SwapKit<
    {
      thorchain: ReturnType<typeof ThorchainProvider>['methods'];
      chainflip: ReturnType<typeof ChainflipProvider>['methods'];
    },
    ConnectWalletType
  >({
    apis: {},
    rpcUrls: {},
    stagenet: IS_STAGENET,
    config: {
      stagenet: IS_STAGENET,
      covalentApiKey: import.meta.env.VITE_COVALENT_API_KEY || process.env.VITE_COVALENT_API_KEY,
      ethplorerApiKey: import.meta.env.VITE_ETHPLORER_API_KEY || process.env.VITE_ETHPLORER_API_KEY,
      blockchairApiKey: IS_LOCAL
        ? import.meta.env.VITE_BLOCKCHAIR_API_KEY
        : import.meta.env.VITE_BLOCKCHAIR_API_KEY || process.env.VITE_BLOCKCHAIR_API_KEY,
      walletConnectProjectId:
        import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || process.env.VITE_WALLETCONNECT_PROJECT_ID,
      keepkeyConfig: {
        apiKey: localStorage.getItem('keepkeyApiKey') || '',
        pairingInfo: {
          name: 'THORSwap',
          imageUrl:
            'https://www.thorswap.finance/logo.png',
          basePath: 'swap',
          url: 'https://app.thorswap.finance',
        },
      },
    },
    // @ts-expect-error
    wallets: supportedWallets,
    // @ts-expect-error
    plugins: [ThorchainProvider, ChainflipProvider],
  });

  sdkClient = core;

  return sdkClient;
};
