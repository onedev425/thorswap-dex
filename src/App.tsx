import { withProfiler } from "@sentry/react";
import { AssetValue } from "@swapkit/sdk";
import { type Wallet, createWallet } from "@swapkit/wallet-exodus";
import { Box } from "components/Atomic";
import { TransactionTrackerModal } from "components/TransactionTracker/TransactionTrackerModal";
import { AnnouncementsProvider } from "context/announcements/AnnouncementsContext";
import { ChakraThemeProvider } from "context/theme/ChakraThemeProvider";
import { ThemeProvider } from "context/theme/ThemeContext";
import { TransactionsModalProvider } from "context/txManager/useTransactionsModal";
import { WalletProvider } from "context/wallet/WalletProvider";
import { HmacSHA512 } from "crypto-js";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { useCallback, useEffect, useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Provider as ReduxProvider } from "react-redux";
import { IS_LEDGER_LIVE, IS_LOCAL } from "settings/config";
import { store as reduxStore } from "store/store";

import { isMobile } from "components/Modals/ConnectWalletModal/hooks";
import DrawerProvider from "./hooks/useWalletDrawer";
import { PublicRoutes } from "./router";

export const exodusWallet =
  IS_LEDGER_LIVE || isMobile
    ? ({} as Wallet)
    : createWallet({
        appId: import.meta.env.VITE_EXODUS_APP_ID ?? process.env.VITE_EXODUS_APP_ID,
        providers: {
          bitcoin: true,
          ethereum: true,
        },
      });

dayjs.extend(duration);
dayjs.extend(relativeTime);

const checkOrigin = () => {
  return true;
};

const MainApp = () => {
  return (
    <Box className="overflow-x-hidden" flex={1}>
      <DrawerProvider>
        <TransactionsModalProvider>
          <PublicRoutes />

          <TransactionTrackerModal />
        </TransactionsModalProvider>
      </DrawerProvider>
    </Box>
  );
};

const AppProviders = () => {
  const [assetsLoaded, setAssetLoaded] = useState(false);

  const loadAssets = useCallback(() => {
    AssetValue.loadStaticAssets().then(({ ok }) => setAssetLoaded(ok));
  }, []);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  if (!(checkOrigin() && assetsLoaded)) return null;

  return (
    <ChakraThemeProvider>
      <HelmetProvider>
        <WalletProvider>
          <ReduxProvider store={reduxStore}>
            <ThemeProvider>
              <AnnouncementsProvider>
                <MainApp />
              </AnnouncementsProvider>
            </ThemeProvider>
          </ReduxProvider>
        </WalletProvider>
      </HelmetProvider>
    </ChakraThemeProvider>
  );
};

export const App = IS_LOCAL ? AppProviders : withProfiler(AppProviders);
