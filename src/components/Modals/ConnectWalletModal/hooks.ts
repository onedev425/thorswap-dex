import type { DerivationPathArray, EVMChain } from "@swapkit/sdk";
import { Chain, WalletOption, getETHDefaultWallet, isDetected } from "@swapkit/sdk";
import type { IconName } from "components/Atomic";
import { showErrorToast } from "components/Toast";
import { useConnectWallet } from "context/wallet/hooks";
import { isIframe } from "helpers/isIframe";
import { getFromStorage, saveInStorage } from "helpers/storage";
import { useCallback, useEffect, useState } from "react";
import { t } from "services/i18n";
import { logEvent, logException } from "services/logger";

import { IS_BETA, IS_LOCAL } from "settings/config";
import {
  WalletNameByWalletOption,
  WalletOptionByWalletType,
  WalletType,
  availableChainsByWallet,
} from "./types";

type WalletItem = {
  type: WalletType;
  icon: IconName;
  label: string;
  visible?: boolean;
  disabled?: boolean;
  tooltip?: string;
};

type UseWalletOptionsParams = {
  isMdActive: boolean;
};

export type WalletSection = {
  title: string;
  visible?: boolean;
  items: WalletItem[];
};

export type DerivationPathType = "nativeSegwitMiddleAccount" | "segwit" | "legacy" | "ledgerLive";

export const isMobile = /iphone|ipad|ipod|ios|android|XiaoMi|MiuiBrowser/i.test(
  navigator.userAgent,
);

export const okxWalletDetected = window.okxwallet || /OKApp/i.test(navigator.userAgent);

export const useWalletOptions = ({ isMdActive }: UseWalletOptionsParams) => {
  const [walletOptions, setWalletOptions] = useState<WalletSection[]>([]);

  useEffect(() => {
    setWalletOptions([
      {
        title: t("views.walletModal.softwareWallets"),
        items: [
          {
            type: WalletType.Walletconnect,
            icon: "walletConnect",
            label: t("views.walletModal.walletConnect"),
          },
          {
            type: WalletType.Talisman,
            icon: "talisman",
            label: t("views.walletModal.talisman"),
          },
          {
            type: WalletType.TrustWallet,
            icon: "trustWallet",
            label: t("views.walletModal.trustWallet"),
          },
          {
            type: WalletType.Rainbow,
            icon: "rainbow",
            label: t("views.walletModal.rainbow"),
          },
          {
            visible: isMdActive || isIframe(),
            type: WalletType.TrustWalletExtension,
            icon: "trustWalletWhite",
            label: t("views.walletModal.trustWalletExtension"),
          },
          {
            type: WalletType.MetaMask,
            icon: "metamask",
            disabled:
              getETHDefaultWallet() !== WalletOption.METAMASK || isDetected(WalletOption.BRAVE),
            label: t("views.walletModal.metaMask"),
            tooltip: isDetected(WalletOption.BRAVE)
              ? t("views.walletModal.disableBraveWallet")
              : getETHDefaultWallet() !== WalletOption.METAMASK
                ? t("views.walletModal.disableDefaultWallet", {
                    wallet: WalletNameByWalletOption[getETHDefaultWallet()],
                  })
                : "",
          },
          //   {
          //     disabled: !isDetected(WalletOption.COINBASE_WEB),
          //     icon: 'coinbaseWallet' as IconName,
          //     type: WalletType.CoinbaseExtension,
          //     visible: isMdActive || isIframe(),
          //     label: t('views.walletModal.coinbaseWalletWeb'),
          //     tooltip: isDetected(WalletOption.BRAVE)
          //       ? t('views.walletModal.disableDefaultWallet', {
          //           wallet: WalletNameByWalletOption[getETHDefaultWallet()],
          //         })
          //       : '',
          //   },
          {
            icon: "coinbaseWallet" as IconName,
            type: WalletType.CoinbaseMobile,
            visible: isMdActive || isIframe(),
            label: t("views.walletModal.coinbaseWalletApp"),
          },
          {
            icon: "xdefi",
            type: WalletType.Xdefi,
            visible: isMdActive || isIframe(),
            label: t("views.walletModal.xdefi"),
          },
          {
            disabled:
              !isDetected(WalletOption.BRAVE) || getETHDefaultWallet() !== WalletOption.BRAVE,
            icon: "brave" as IconName,
            type: WalletType.Brave,
            visible: isMdActive || !isIframe(),
            label: t("views.walletModal.braveWallet"),
            // @ts-expect-error
            tooltip: navigator?.brave?.isBrave?.()
              ? getETHDefaultWallet() !== WalletOption.BRAVE
                ? t("views.walletModal.enableBraveWallet")
                : ""
              : t("views.walletModal.installBraveBrowser"),
          },
          {
            disabled: !(okxWalletDetected || isMobile),
            visible: !isIframe(),
            icon: "okx" as IconName,
            type: isMobile ? WalletType.OkxMobile : WalletType.Okx,
            label: t("views.walletModal.okxWallet"),
            tooltip: window.okxwallet ? "" : t("views.walletModal.installOkxWallet"),
          },
          {
            icon: "keplr",
            label: t("views.walletModal.keplr"),
            type: WalletType.Keplr,
            visible: isMdActive || isIframe(),
          },
          {
            icon: "exodus",
            label: t("views.walletModal.passkeys"),
            visible: IS_BETA || IS_LOCAL,
            type: WalletType.Exodus,
          },
        ],
      },
      {
        title: t("views.walletModal.hardwareWallets"),
        visible: isMdActive || isIframe(),
        items: [
          { type: WalletType.Ledger, icon: "ledger", label: t("views.walletModal.ledger") },
          { type: WalletType.Trezor, icon: "trezor", label: t("views.walletModal.trezor") },
          { type: WalletType.Keepkey, icon: "keepkey", label: t("views.walletModal.keepkey") },
        ],
      },
      {
        title: "Keystore",
        items: [
          { type: WalletType.Keystore, icon: "keystore", label: t("views.walletModal.keystore") },
          {
            type: WalletType.CreateKeystore,
            icon: "plusCircle",
            label: t("views.walletModal.createKeystore"),
          },
          { type: WalletType.Phrase, icon: "import", label: t("views.walletModal.importPhrase") },
        ],
      },
    ]);
  }, [isMdActive]);

  return walletOptions;
};

export type HandleWalletConnectParams = {
  walletType?: WalletType;
  derivationPath?: DerivationPathArray;
  ledgerIndex: number;
  chains?: Chain[];
  derivationPathType?: DerivationPathType;
};

export const useHandleWalletConnect = ({
  walletType,
  ledgerIndex,
  chains,
  derivationPathType,
}: HandleWalletConnectParams) => {
  const {
    connectKeplr,
    connectKeepkey,
    connectLedger,
    connectTalismanWallet,
    connectTrezor,
    connectWalletconnect,
    connectEVMWalletExtension,
    connectXdefiWallet,
    // connectExodus,
    connectOkx,
    connectCoinbaseMobile,
  } = useConnectWallet();

  const handleConnectWallet = useCallback(
    async (params?: HandleWalletConnectParams) => {
      const { getDerivationPathFor } = await import("@swapkit/sdk");

      const selectedChains = params?.chains || chains;
      const selectedWalletType = params?.walletType || walletType;
      const type = params?.derivationPathType || derivationPathType;
      const derivationPath =
        params?.derivationPath ||
        (getDerivationPathFor({
          chain: selectedChains?.[0] || Chain.THORChain,
          type,
          index: ledgerIndex,
        }) as DerivationPathArray);
      if (!(selectedChains && selectedWalletType)) return;

      if (getFromStorage("restorePreviousWallet")) {
        saveInStorage({
          key: "previousWallet",
          value: { walletType: selectedWalletType, chains: selectedChains, ledgerIndex },
        });
      }

      logEvent("connect_wallet", {
        type: selectedWalletType,
        chains: selectedChains,
        info: { derivationPath, ledgerIndex },
      });

      try {
        switch (selectedWalletType) {
          case WalletType.Ledger:
            return connectLedger(selectedChains[0], derivationPath, ledgerIndex);
          case WalletType.Trezor:
            return connectTrezor(selectedChains[0], derivationPath, ledgerIndex);
          case WalletType.Xdefi:
            return connectXdefiWallet(selectedChains);
          //   case WalletType.Exodus:
          //     return connectExodus(
          //       selectedChains as (Chain.Bitcoin | Chain.BinanceSmartChain | Chain.Ethereum)[],
          //     );
          case WalletType.Talisman:
            return connectTalismanWallet(selectedChains);
          case WalletType.Keplr:
            return connectKeplr(selectedChains as (Chain.Cosmos | Chain.Kujira)[]);
          case WalletType.Okx:
            return connectOkx(selectedChains);
          case WalletType.Keepkey:
            // @ts-expect-error
            return connectKeepkey(selectedChains, derivationPath);

          case WalletType.CoinbaseMobile:
            return connectCoinbaseMobile(selectedChains as EVMChain[]);

          case WalletType.Brave:
          case WalletType.MetaMask:
          case WalletType.TrustWalletExtension:
          case WalletType.OkxMobile:
          case WalletType.CoinbaseExtension:
            return connectEVMWalletExtension(
              selectedChains as EVMChain[],
              WalletOptionByWalletType[selectedWalletType],
            );

          case WalletType.Rainbow:
          case WalletType.TrustWallet:
          case WalletType.Walletconnect:
            return connectWalletconnect(selectedChains);

          default: {
            logException(new Error(`${selectedWalletType} not supported`));
            return null;
          }
        }
      } catch (error) {
        logException(error as Error);
        showErrorToast(
          `${t("txManager.failed")} ${selectedWalletType}`,
          undefined,
          undefined,
          error as Error,
        );
      }
    },
    [
      chains,
      connectEVMWalletExtension,
      connectCoinbaseMobile,
      connectKeplr,
      connectKeepkey,
      connectLedger,
      //   connectExodus,
      connectOkx,
      connectTrezor,
      connectTalismanWallet,
      connectWalletconnect,
      connectXdefiWallet,
      derivationPathType,
      ledgerIndex,
      walletType,
    ],
  );

  const addReconnectionOnAccountsChanged = useCallback(async () => {
    const { addAccountsChangedCallback } = await import("@swapkit/sdk");
    addAccountsChangedCallback(() => {
      handleConnectWallet();
    });
  }, [handleConnectWallet]);

  return { handleConnectWallet, addReconnectionOnAccountsChanged };
};

type HandleWalletTypeSelectParams = {
  setSelectedWalletType: React.Dispatch<React.SetStateAction<WalletType | undefined>>;
  setSelectedChains: React.Dispatch<React.SetStateAction<Chain[]>>;
  selectedChains: Chain[];
};

const WalletTypeToOption: Record<WalletType, WalletOption> = {
  [WalletType.Brave]: WalletOption.BRAVE,
  [WalletType.CoinbaseExtension]: WalletOption.COINBASE_WEB,
  [WalletType.CoinbaseMobile]: WalletOption.COINBASE_MOBILE,
  [WalletType.CreateKeystore]: WalletOption.KEYSTORE,
  [WalletType.Keplr]: WalletOption.KEPLR,
  [WalletType.Keepkey]: WalletOption.KEEPKEY,
  [WalletType.Keystore]: WalletOption.KEYSTORE,
  [WalletType.Ledger]: WalletOption.LEDGER,
  [WalletType.MetaMask]: WalletOption.METAMASK,
  [WalletType.Okx]: WalletOption.OKX,
  [WalletType.OkxMobile]: WalletOption.OKX_MOBILE,
  [WalletType.Phrase]: WalletOption.KEYSTORE,
  [WalletType.Rainbow]: WalletOption.WALLETCONNECT,
  [WalletType.Talisman]: WalletOption.TALISMAN,
  [WalletType.Trezor]: WalletOption.TREZOR,
  [WalletType.TrustWallet]: WalletOption.WALLETCONNECT,
  [WalletType.TrustWalletExtension]: WalletOption.TRUSTWALLET_WEB,
  [WalletType.Walletconnect]: WalletOption.WALLETCONNECT,
  [WalletType.Xdefi]: WalletOption.XDEFI,
  [WalletType.Exodus]: WalletOption.EXODUS,
};

export const useHandleWalletTypeSelect = ({
  setSelectedWalletType,
  setSelectedChains,
  selectedChains,
}: HandleWalletTypeSelectParams) => {
  const handleEVMWallet = useCallback(async (walletType: WalletType) => {
    const { isDetected } = await import("@swapkit/sdk");
    if (isDetected(WalletTypeToOption[walletType])) return true;

    switch (walletType) {
      case WalletType.MetaMask:
        return window.open("https://metamask.io");
      case WalletType.TrustWalletExtension:
        return window.open("https://trustwallet.com/browser-extension/");
      case WalletType.CoinbaseExtension:
        return window.open("https://www.coinbase.com/wallet/articles/getting-started-extension");
      case WalletType.Xdefi:
        return window.open("https://xdefi.io");
      case WalletType.Talisman:
        return window.open("https://www.talisman.xyz/");
      case WalletType.Brave:
        return window.open("brave://wallet/");
      case WalletType.OkxMobile:
        return window.open("okx://wallet/dapp/details?dappUrl=https://app.thorswap.finance/swap");
    }
  }, []);

  const handleWindowWallet = useCallback((windowPath: "keplr" | "okxwallet") => {
    if (window[windowPath]) return true;

    switch (windowPath) {
      case "okxwallet":
        return window.open("https://www.okx.com/web3");
      case "keplr":
        return window.open("https://keplr.app");
    }
  }, []);

  const connectSelectedWallet = useCallback(
    (selectedWallet: WalletType) => {
      switch (selectedWallet) {
        case WalletType.Xdefi:
          return handleEVMWallet(selectedWallet);
        case WalletType.Keplr:
          return handleWindowWallet("keplr");
        case WalletType.Okx:
          return handleWindowWallet("okxwallet");

        default:
          return true;
      }
    },
    [handleEVMWallet, handleWindowWallet],
  );

  const getChainsToSelect = useCallback(
    (chains: Chain[], walletType: WalletType, nextWalletType?: WalletType) => {
      if (!nextWalletType) {
        const allAvailableChainsSelected = chains.every((chain) =>
          availableChainsByWallet[walletType].includes(chain),
        );

        return allAvailableChainsSelected ? [] : chains;
      }

      switch (walletType) {
        case WalletType.Ledger:
        case WalletType.Trezor:
        case WalletType.TrustWalletExtension:
        case WalletType.CoinbaseExtension:
        case WalletType.CoinbaseMobile:
        case WalletType.MetaMask: {
          return [selectedChains[0] || Chain.Ethereum];
        }

        default:
          return chains.length ? chains : availableChainsByWallet[walletType];
      }
    },
    [selectedChains],
  );

  const handleSuccessWalletConnection = useCallback(
    (walletType: WalletType) => {
      setSelectedWalletType((type) => {
        const nextWalletType = type === walletType ? undefined : walletType;

        setSelectedChains(
          (chains) => getChainsToSelect(chains, walletType, nextWalletType) as Chain[],
        );

        return nextWalletType;
      });
    },
    [getChainsToSelect, setSelectedChains, setSelectedWalletType],
  );

  const handleWalletTypeSelect = useCallback(
    async (selectedWallet: WalletType) => {
      const success = await connectSelectedWallet(selectedWallet);

      if (success) {
        handleSuccessWalletConnection(selectedWallet);
      }
    },
    [connectSelectedWallet, handleSuccessWalletConnection],
  );

  return handleWalletTypeSelect;
};
