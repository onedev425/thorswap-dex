import { AssetValue } from '@swapkit/core';
import { Box } from 'components/Atomic';
import { TransactionTrackerModal } from 'components/TransactionTracker/TransactionTrackerModal';
import { AnnouncementsProvider } from 'context/announcements/AnnouncementsContext';
import { ChakraThemeProvider } from 'context/theme/ChakraThemeProvider';
import { ThemeProvider } from 'context/theme/ThemeContext';
import { TransactionsModalProvider } from 'context/txManager/useTransactionsModal';
import { WalletProvider } from 'context/wallet/WalletProvider';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useCallback, useEffect, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { store as reduxStore } from 'store/store';

import DrawerProvider from '../src/hooks/useWalletDrawer';

import { PublicRoutes } from './router';

dayjs.extend(duration);
dayjs.extend(relativeTime);

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

const App = () => {
  const [assetsLoaded, setAssetLoaded] = useState(false);

  const loadAssets = useCallback(() => {
    AssetValue.loadStaticAssets().then(({ ok }) => setAssetLoaded(ok));
  }, []);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  if (!assetsLoaded) return null;

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

export default App;
