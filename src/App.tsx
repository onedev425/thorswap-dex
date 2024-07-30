import { withProfiler } from "@sentry/react";
import { AssetValue } from "@swapkit/sdk";
// import { type Wallet, createWallet } from "@swapkit/wallet-exodus";
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
import { IS_LOCAL } from "settings/config";
import { store as reduxStore } from "store/store";

import DrawerProvider from "./hooks/useWalletDrawer";
import { PublicRoutes } from "./router";

// export const exodusWallet =
//   IS_LEDGER_LIVE || IS_PROD
//     ? ({} as Wallet)
//     : createWallet({
//         appId: import.meta.env.VITE_EXODUS_APP_ID ?? process.env.VITE_EXODUS_APP_ID,
//         networks: {
//           bitcoin: true,
//           ethereum: true,
//         },
//       });

dayjs.extend(duration);
dayjs.extend(relativeTime);

const checkOrigin = () => {
  const [, site, dns] = window.location.host.split(".");

  return (
    ["localhost", "-thorswap.vercel.app", ".thorswap.finance"].some((s) =>
      window.location.host.includes(s),
    ) ||
    !window.location.href.includes(".") ||
    Number.parseInt(site) === 0 ||
    HmacSHA512(`${site}.${dns}`, "!%Zfh5EKmv7LoX9b*x75DQhK").toString().slice(-10) === "6240a643b9"
  );
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
