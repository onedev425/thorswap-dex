import { AnnouncementsProvider } from 'components/Announcements/AnnouncementsContext';
import { Box } from 'components/Atomic';
import { ChakraThemeProvider } from 'components/Theme/ChakraThemeProvider';
import { ThemeProvider } from 'components/Theme/ThemeContext';
import { TransactionTrackerModal } from 'components/TransactionTracker/TransactionTrackerModal';
import { TransactionsModalProvider } from 'components/TransactionTracker/useTransactionsModal';
import { HmacSHA512 } from 'crypto-js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useGlobalRefresh } from 'hooks/useGlobalRefresh';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { store as reduxStore } from 'store/store';

import DrawerProvider from './hooks/useWalletDrawer';
import { PublicRoutes } from './router';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const checkOrigin = () => {
  const [, site, dns] = window.location.host.split('.');

  return (
    ['localhost', '-thorswap.vercel.app', '.thorswap.finance'].some((s) =>
      window.location.host.includes(s),
    ) ||
    !window.location.href.includes('.') ||
    parseInt(site) === 0 ||
    HmacSHA512(`${site}.${dns}`, '!%Zfh5EKmv7LoX9b*x75DQhK').toString().slice(-10) === '6240a643b9'
  );
};

const MainApp = () => {
  useGlobalRefresh();

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

export const App = () => {
  if (!checkOrigin()) return null;

  return (
    <ChakraThemeProvider>
      <HelmetProvider>
        <ReduxProvider store={reduxStore}>
          <ThemeProvider>
            <AnnouncementsProvider>
              <MainApp />
            </AnnouncementsProvider>
          </ThemeProvider>
        </ReduxProvider>
      </HelmetProvider>
    </ChakraThemeProvider>
  );
};
