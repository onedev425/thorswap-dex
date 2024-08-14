import { ChainflipPlugin } from "@swapkit/plugin-chainflip";
import { EVMPlugin } from "@swapkit/plugin-evm";
import { MayachainPlugin, ThorchainPlugin } from "@swapkit/plugin-thorchain";
import type { ConnectWalletParams } from "@swapkit/sdk";
import { SwapKit } from "@swapkit/sdk";
import { coinbaseWallet } from "@swapkit/wallet-coinbase";
// import { exodusWallet } from "@swapkit/wallet-exodus";
import { wallets } from "@swapkit/wallets";
import { IS_LOCAL, IS_STAGENET } from "settings/config";
import { apiV2BaseUrl } from "store/thorswap/api";

const plugins = {
  ...ThorchainPlugin,
  ...MayachainPlugin,
  ...ChainflipPlugin,
  ...EVMPlugin,
};

let sdkClient: ReturnType<typeof SwapKit<typeof plugins, typeof wallets>>;

// & typeof exodusWallet

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
      chainflipBrokerUrl: `${apiV2BaseUrl}/channel`,
    },
    wallets: {
      ...wallets,
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
      //   ...exodusWallet,
    },
    plugins,
  });

  sdkClient = core;

  return core;
};
