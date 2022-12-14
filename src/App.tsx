import { AnnouncementsProvider } from 'components/Announcements/AnnouncementsContext';
import { Box } from 'components/Atomic';
import { ChakraThemeProvider } from 'components/Theme/ChakraThemeProvider';
import { ThemeProvider } from 'components/Theme/ThemeContext';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useGlobalRefresh } from 'hooks/useGlobalRefresh';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { store as reduxStore } from 'store/store';

import { checkOrigin } from './helpers/checkOrigin';
import DrawerProvider from './hooks/useWalletDrawer';
import { PublicRoutes } from './router';

dayjs.extend(duration);

const MainApp = () => {
  useGlobalRefresh();

  return (
    <Box className="overflow-x-hidden" flex={1}>
      <DrawerProvider>
        <PublicRoutes />
      </DrawerProvider>
    </Box>
  );
};

function App() {
  if (!checkOrigin()) return null;

  return (
    <HelmetProvider>
      <ReduxProvider store={reduxStore}>
        <ThemeProvider>
          <ChakraThemeProvider>
            <AnnouncementsProvider>
              <MainApp />
            </AnnouncementsProvider>
          </ChakraThemeProvider>
        </ThemeProvider>
      </ReduxProvider>
    </HelmetProvider>
  );
}

export default App;
