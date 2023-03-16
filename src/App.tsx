import { AnnouncementsProvider } from 'components/Announcements/AnnouncementsContext';
import { Box } from 'components/Atomic';
import { ChakraThemeProvider } from 'components/Theme/ChakraThemeProvider';
import { ThemeProvider } from 'components/Theme/ThemeContext';
import { TransactionsModalProvider } from 'components/TransactionTracker/useTransactionsModal';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { checkOrigin } from 'helpers/checkOrigin';
import { useGlobalRefresh } from 'hooks/useGlobalRefresh';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { store as reduxStore } from 'store/store';

import DrawerProvider from './hooks/useWalletDrawer';
import { PublicRoutes } from './router';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const MainApp = () => {
  useGlobalRefresh();

  return (
    <Box className="overflow-x-hidden" flex={1}>
      <DrawerProvider>
        <TransactionsModalProvider>
          <PublicRoutes />
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
