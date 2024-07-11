import { ChainflipPlugin } from "@swapkit/plugin-chainflip";
import { MayachainPlugin, ThorchainPlugin } from "@swapkit/plugin-thorchain";
import type { ConnectWalletParams } from "@swapkit/sdk";
import { SwapKit } from "@swapkit/sdk";
import { coinbaseWallet } from "@swapkit/wallet-coinbase";
import { evmWallet } from "@swapkit/wallet-evm-extensions";
import { keepkeyWallet } from "@swapkit/wallet-keepkey";
import { keplrWallet } from "@swapkit/wallet-keplr";
import { keystoreWallet } from "@swapkit/wallet-keystore";
import { ledgerWallet } from "@swapkit/wallet-ledger";
import { okxWallet } from "@swapkit/wallet-okx";
import { talismanWallet } from "@swapkit/wallet-talisman";
import { trezorWallet } from "@swapkit/wallet-trezor";
import { walletconnectWallet } from "@swapkit/wallet-wc";
import { xdefiWallet } from "@swapkit/wallet-xdefi";
import { IS_LOCAL, IS_STAGENET } from "settings/config";
import { apiV2BaseUrl } from "store/thorswap/api";

const wallets = {
  connectCoinbaseWallet: ({ addChain, config, rpcUrls, apis }: ConnectWalletParams) =>
    coinbaseWallet.connectCoinbaseWallet({
      addChain,
      config,
      rpcUrls,
      apis,
      coinbaseWalletSettings: {
        appName: "THORSwap",
        appLogoUrl: "https://www.thorswap.finance/logo.png",
        overrideIsMetaMask: false,
      },
    }),
  ...evmWallet,
  ...keepkeyWallet,
  ...keplrWallet,
  ...keystoreWallet,
  ...ledgerWallet,
  ...okxWallet,
  ...trezorWallet,
  ...walletconnectWallet,
  ...xdefiWallet,
  ...talismanWallet,
} as const;

const plugins = {
  ...ThorchainPlugin,
  ...MayachainPlugin,
  chainflip: {
    ...ChainflipPlugin.chainflip,
    config: { brokerEndpoint: `${apiV2BaseUrl}/channel` },
  },
} as const;

type Client = ReturnType<typeof SwapKit<typeof plugins, typeof wallets>>;

let sdkClient: Client;

export const getSwapKitClient = () => {
  if (sdkClient) return sdkClient;

  const core = SwapKit({
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
        apiKey: localStorage.getItem("keepkeyApiKey") || "",
        pairingInfo: {
          name: "THORSwap",
          imageUrl: "https://www.thorswap.finance/logo.png",
          basePath: "swap",
          url: "https://app.thorswap.finance",
        },
      },
    },
    wallets,
    plugins,
  });

  sdkClient = core;

  return sdkClient;
};
