import { AnnouncementsProvider } from 'components/Announcements/AnnouncementsContext';
import { Box } from 'components/Atomic';
import { ChakraThemeProvider } from 'components/Theme/ChakraThemeProvider';
import { ThemeProvider } from 'components/Theme/ThemeContext';
import { TransactionTrackerModal } from 'components/TransactionTracker/TransactionTrackerModal';
import { TransactionsModalProvider } from 'components/TransactionTracker/useTransactionsModal';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
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

function App() {
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
}

export default App;
