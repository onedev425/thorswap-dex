import type { AssetValue, DerivationPathArray, EVMChain, WalletChain } from "@swapkit/sdk";
import { Chain, WalletOption } from "@swapkit/sdk";
import type { EVMWalletOptions } from "@swapkit/wallet-evm-extensions";
import type { Keystore } from "@swapkit/wallet-keystore";
import { isMobile, okxWalletDetected } from "components/Modals/ConnectWalletModal/hooks";
import { showErrorToast, showInfoToast } from "components/Toast";
import { useWalletContext, useWalletDispatch, useWalletState } from "context/wallet/WalletProvider";
import { chainName } from "helpers/chainName";
import { t } from "i18next";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ledgerLive } from "services/ledgerLive";
import { logEvent, logException } from "services/logger";

import type { LedgerLiveChain } from "../../../ledgerLive/wallet/LedgerLive";
import { connectLedgerLive, mapLedgerChainToChain } from "../../../ledgerLive/wallet/LedgerLive";
import { exodusWallet } from "../../App";

const useIsMounted = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  return isMounted;
};

export const useWallet = () => {
  const { wallet, chainLoading } = useWalletState();
  const isMounted = useIsMounted();

  const isWalletLoading = useMemo(
    () =>
      Object.keys(wallet).some((key) => {
        return chainLoading[key as keyof typeof wallet];
      }),
    [chainLoading, wallet],
  );

  const getWallet = useCallback(
    (chain: Chain) => {
      if (isMounted) {
        return wallet[chain as keyof typeof wallet];
      }

      return null;
    },
    [wallet, isMounted],
  );

  const getWalletAddress = useCallback(
    (chain: Chain) => {
      if (isMounted) {
        return wallet[chain as keyof typeof wallet]?.address || "";
      }
      return "";
    },
    [isMounted, wallet],
  );

  const hasWallet = useMemo(() => {
    if (isMounted) {
      return Object.values(wallet).some((w) => !!w);
    }
    return false;
  }, [wallet, isMounted]);

  const walletAddresses = useMemo(() => {
    if (isMounted) {
      return Object.entries(wallet)
        .map(([chain, w]) => (chain === Chain.Ethereum ? w?.address?.toLowerCase() : w?.address))
        .filter((a): a is string => !!a);
    }
    return [];
  }, [wallet, isMounted]);

  const walletState = useMemo(() => {
    return wallet;
  }, [wallet, isMounted]);

  return {
    wallet: walletState,
    chainLoading,
    walletAddresses,
    isWalletLoading,
    getWalletAddress,
    hasWallet,
    getWallet,
  };
};

export const useKeystore = () => {
  const { wallet, keystore, pubKey, phrase } = useWalletState();

  const signingRequired = useCallback(
    (assets: AssetValue[]) => {
      if (!keystore) return false;
      return assets.some(
        (asset) => wallet[asset.chain as keyof typeof wallet]?.walletType === WalletOption.KEYSTORE,
      );
    },
    [keystore, wallet],
  );

  return useMemo(
    () => ({ signingRequired, keystore, pubKey, phrase }),
    [keystore, pubKey, phrase, signingRequired],
  );
};

export const useWalletConnectModal = () => {
  const [{ isConnectModalOpen }, walletDispatch] = useWalletContext();
  const setIsConnectModalOpen = useCallback(
    (payload: boolean) => walletDispatch({ type: "setIsConnectModalOpen", payload }),
    [walletDispatch],
  );

  return { isConnectModalOpen, setIsConnectModalOpen };
};

export const useLedgerLive = () => {
  const [{ wallet }, walletDispatch] = useWalletContext();
  const updateLedgerLiveBalance = useCallback(
    async (chain: Chain) => {
      const chainWallet = wallet[chain as keyof typeof wallet];
      if (!chainWallet) return;
      const { getBalance } = chainWallet?.walletMethods || {};
      const balance = (await getBalance(chainWallet?.address)) as AssetValue[];

      if (chain !== Chain.Ethereum) await new Promise((res) => setTimeout(res, 200));

      walletDispatch({
        type: "setChainWallet",
        payload: {
          chain,
          data: {
            ...chainWallet,
            address: chainWallet?.address || "",
            walletType: WalletOption.LEDGER,
            balance,
          },
        },
      });
      return { chain, balance };
    },
    [wallet, walletDispatch],
  );

  return { updateLedgerLiveBalance };
};

export const useWalletBalance = () => {
  const { wallet, chainLoading } = useWalletState();
  const walletDispatch = useWalletDispatch();
  const isMounted = useIsMounted();
  const walletRef = useRef(wallet);
  const chainLoadingRef = useRef(chainLoading);

  useEffect(() => {
    walletRef.current = wallet;
    chainLoadingRef.current = chainLoading;
  }, [wallet, chainLoading]);

  const getWalletByChain = useCallback(
    async (chain: Chain) => {
      if (!isMounted) return;

      const abortController = new AbortController();
      const signal = abortController.signal;

      try {
        const client = await (await import("services/swapKit")).getSwapKitClient();
        const walletClient = client.getWallet(chain);

        if (!walletClient) {
          return;
        }
        walletDispatch({ type: "setChainWalletLoading", payload: { chain, loading: true } });

        // Create a wrapper function that can be aborted
        const getWalletWithBalanceWrapper = async () => {
          if (signal.aborted) throw new DOMException("Aborted", "AbortError");
          return await client.getWalletWithBalance(chain, true);
        };

        const data: Todo = await Promise.race([
          getWalletWithBalanceWrapper(),
          new Promise((_, reject) => {
            signal.addEventListener("abort", () =>
              reject(new DOMException("Aborted", "AbortError")),
            );
          }),
        ]);

        if (isMounted && !signal.aborted && data) {
          walletDispatch({
            type: "setChainWallet",
            payload: {
              chain,
              data: {
                chain,
                address: data?.address || "",
                balance: data?.balance || [],
                walletType: data?.walletType || WalletOption.KEYSTORE,
              },
            },
          });
        }
      } catch (error: unknown) {
        if ((error as Todo).name === "AbortError") {
          return;
        }

        logException(error as Error);
      } finally {
        if (isMounted) {
          walletDispatch({ type: "setChainWalletLoading", payload: { chain, loading: false } });
        }
      }

      return () => {
        abortController.abort();
      };
    },
    [walletDispatch, isMounted],
  );

  const reloadAllWallets = useCallback(
    (chains: (Chain | undefined)[]) => {
      const abortControllers: AbortController[] = [];

      for (const chain of chains) {
        if (chain) {
          getWalletByChain(chain).then((cleanup) => {
            if (cleanup) {
              // @ts-expect-error
              abortControllers.push({ abort: cleanup });
            }
          });
        }
      }

      return () => {
        for (const controller of abortControllers) {
          controller.abort();
        }
      };
    },
    [getWalletByChain],
  );

  return { getWalletByChain, reloadAllWallets };
};

export const useConnectWallet = () => {
  const walletDispatch = useWalletDispatch();
  const { getWalletByChain, reloadAllWallets } = useWalletBalance();
  const isMounted = useIsMounted();

  const connectLedger = useCallback(
    async (chain: Chain, derivationPath: DerivationPathArray, index: number) => {
      if (!isMounted) return;

      const options = { chain: chainName(chain), index };

      const { connectLedger: swapKitConnectLedger } = await (
        await import("services/swapKit")
      ).getSwapKitClient();

      showInfoToast(t("notification.connectingLedger", options));
      // @ts-expect-error
      await swapKitConnectLedger([chain], derivationPath);
      await getWalletByChain(chain);

      showInfoToast(t("notification.connectedLedger", options));
    },
    [getWalletByChain],
  );

  const connectLedgerLiveWallet = useCallback(
    async (chains?: Chain[]) => {
      if (!isMounted) return;

      const account = await ledgerLive().requestAccount(chains);
      const chain = mapLedgerChainToChain(account.currency as LedgerLiveChain);
      const { wallet } = await connectLedgerLive(chain, account);

      walletDispatch({ type: "setChainWallet", payload: { chain, data: { ...wallet, chain } } });
    },
    [walletDispatch],
  );

  const connectTrezor = useCallback(
    async (chain: Chain, derivationPath: DerivationPathArray, index: number) => {
      if (!isMounted) return;

      const options = { chain: chainName(chain), index };
      const { connectTrezor: swapKitConnectTrezor } = await (
        await import("services/swapKit")
      ).getSwapKitClient();

      try {
        showInfoToast(t("notification.connectingTrezor", options));
        // @ts-expect-error
        await swapKitConnectTrezor([chain], derivationPath);
        await getWalletByChain(chain as Chain);
        showInfoToast(t("notification.connectedTrezor", options));
      } catch (error) {
        logException(error as Error);
        showErrorToast(
          t("notification.trezorFailed", options),
          undefined,
          undefined,
          error as Error,
        );
      }
    },
    [getWalletByChain],
  );

  const connectXdefiWallet = useCallback(
    async (chains: Chain[]) => {
      if (!isMounted) return;

      const { connectXDEFI: swapKitConnectXDEFI } = await (
        await import("services/swapKit")
      ).getSwapKitClient();

      // @ts-expect-error
      await swapKitConnectXDEFI(chains);

      reloadAllWallets(chains);
    },
    [reloadAllWallets],
  );

  const connectTalismanWallet = useCallback(
    async (chains: Chain[]) => {
      if (!isMounted) return;

      const { connectTalisman: swapKitConnectTalisman } = await (
        await import("services/swapKit")
      ).getSwapKitClient();

      // @ts-expect-error
      await swapKitConnectTalisman(chains);

      reloadAllWallets(chains);
    },
    [reloadAllWallets],
  );

  const connectCoinbaseMobile = useCallback(
    async (chains: EVMChain[]) => {
      if (!isMounted) return;

      const skclient = await (await import("services/swapKit")).getSwapKitClient();

      await skclient.connectCoinbaseWallet(chains);

      reloadAllWallets(chains);
    },
    [reloadAllWallets],
  );

  const connectEVMWalletExtension = useCallback(
    async (chains: EVMChain[], wallet: WalletOption) => {
      if (!isMounted) return;

      if (wallet === WalletOption.OKX_MOBILE && isMobile && !okxWalletDetected) {
        window.open("okx://wallet/dapp/details?dappUrl=https://app.thorswap.finance/swap");
        return;
      }
      const { connectEVMWallet: swapKitConnectEVMWallet } = await (
        await import("services/swapKit")
      ).getSwapKitClient();

      await swapKitConnectEVMWallet(chains, wallet as EVMWalletOptions);

      reloadAllWallets(chains);
    },
    [reloadAllWallets],
  );

  const connectBraveWallet = useCallback(
    async (chains: EVMChain[]) => {
      if (!isMounted) return;

      const { connectEVMWallet: swapKitConnectEVMWallet } = await (
        await import("services/swapKit")
      ).getSwapKitClient();

      await swapKitConnectEVMWallet(chains, WalletOption.BRAVE);

      reloadAllWallets(chains);
    },
    [reloadAllWallets],
  );

  const connectWalletconnect = useCallback(
    async (chains: Chain[]) => {
      if (!isMounted) return;

      const { connectWalletconnect } = await (await import("services/swapKit")).getSwapKitClient();

      // @ts-expect-error
      await connectWalletconnect(chains, {
        listeners: {
          disconnect: () => walletDispatch({ type: "disconnect", payload: undefined }),
        },
      });

      reloadAllWallets(chains);
    },
    [reloadAllWallets, walletDispatch],
  );

  const connectOkx = useCallback(
    async (chains: Chain[]) => {
      if (!isMounted) return;

      const { connectOkx } = await (await import("services/swapKit")).getSwapKitClient();
      // @ts-expect-error
      await connectOkx(chains);
      reloadAllWallets(chains);
    },
    [reloadAllWallets],
  );

  const connectTrustWalletExtension = useCallback(
    async (chain: Chain) => {
      if (!isMounted) return;

      const { connectEVMWallet: swapKitConnectEVMWallet } = await (
        await import("services/swapKit")
      ).getSwapKitClient();
      // @ts-expect-error
      await swapKitConnectEVMWallet([chain], WalletOption.TRUSTWALLET_WEB);

      reloadAllWallets([chain]);
    },
    [reloadAllWallets],
  );

  const connectCoinbaseWalletExtension = useCallback(
    async (chain: EVMChain) => {
      if (!isMounted) return;

      const { connectEVMWallet: swapKitConnectEVMWallet } = await (
        await import("services/swapKit")
      ).getSwapKitClient();

      await swapKitConnectEVMWallet([chain], WalletOption.COINBASE_WEB);

      reloadAllWallets([chain]);
    },
    [reloadAllWallets],
  );

  const connectMetamask = useCallback(
    async (chain: EVMChain) => {
      if (!isMounted) return;

      const { connectEVMWallet: swapKitConnectEVMWallet } = await (
        await import("services/swapKit")
      ).getSwapKitClient();

      await swapKitConnectEVMWallet([chain], WalletOption.METAMASK);

      reloadAllWallets([chain]);
    },
    [reloadAllWallets],
  );

  const connectExodus = useCallback(
    async (chains: (Chain.Ethereum | Chain.Bitcoin | Chain.BinanceSmartChain)[]) => {
      const { connectExodusWallet: swapKitConnectExodus } = await (
        await import("services/swapKit")
      ).getSwapKitClient();

      await swapKitConnectExodus(chains, exodusWallet);

      reloadAllWallets(chains);
    },
    [reloadAllWallets],
  );

  const connectKeplr = useCallback(
    async (chains: (Chain.Cosmos | Chain.Kujira)[]) => {
      if (!isMounted) return;

      const { connectKeplr: swapKitConnectKeplr } = await (
        await import("services/swapKit")
      ).getSwapKitClient();

      await swapKitConnectKeplr(chains);

      reloadAllWallets(chains);
    },
    [reloadAllWallets],
  );

  const unlockKeystore = useCallback(
    async (keystore: Keystore, phrase: string, chains: WalletChain[]) => {
      if (!isMounted) return;

      const { connectKeystore } = await (await import("services/swapKit")).getSwapKitClient();
      const { ThorchainToolbox } = await import("@swapkit/toolbox-cosmos");
      const { getPubKeyFromMnemonic } = ThorchainToolbox({});
      const pubKey = await getPubKeyFromMnemonic(phrase);

      await connectKeystore(chains, phrase, 0);
      walletDispatch({ type: "connectKeystore", payload: { keystore, phrase, pubKey } });
      logEvent("connect_wallet", { type: WalletOption.KEYSTORE, chains });
      reloadAllWallets(chains);
    },
    [reloadAllWallets, walletDispatch],
  );

  const connectKeepkey = useCallback(
    async (
      chains: (
        | Chain.Arbitrum
        | Chain.Avalanche
        | Chain.BinanceSmartChain
        | Chain.Bitcoin
        | Chain.BitcoinCash
        | Chain.Cosmos
        | Chain.Dash
        | Chain.Dogecoin
        | Chain.Ethereum
        | Chain.Litecoin
        | Chain.Maya
        | Chain.Optimism
        | Chain.Polygon
        | Chain.THORChain
      )[],
      derivationPath?: DerivationPathArray,
    ) => {
      if (!isMounted) return;

      const { connectKeepkey: swapKitConnectKeepkey } = await (
        await import("services/swapKit")
      ).getSwapKitClient();

      showInfoToast(t("notification.connectingKeepkey"));

      const keepkeyApiKey = await swapKitConnectKeepkey(
        chains,
        chains.length === 1 && derivationPath ? [derivationPath] : undefined,
      );
      // @ts-expect-error
      localStorage.setItem("keepkeyApiKey", (keepkeyApiKey as string) || "");
      await reloadAllWallets(chains);

      showInfoToast(t("notification.connectedKeepkey"));
    },
    [reloadAllWallets],
  );

  return {
    unlockKeystore,
    connectLedger,
    connectLedgerLiveWallet,
    connectTrezor,
    connectXdefiWallet,
    connectEVMWalletExtension,
    connectBraveWallet,
    connectTalismanWallet,
    connectTrustWalletExtension,
    connectCoinbaseMobile,
    connectCoinbaseWalletExtension,
    connectMetamask,
    connectKeplr,
    connectWalletconnect,
    connectOkx,
    connectKeepkey,
    connectExodus,
  };
};
