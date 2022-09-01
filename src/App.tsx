import { AnnouncementsProvider } from 'components/Announcements/AnnouncementsContext';
import { Box } from 'components/Atomic';
import { ThemeProvider } from 'components/Theme/ThemeContext';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useGlobalRefresh } from 'hooks/useGlobalRefresh';
import { Provider as ReduxProvider } from 'react-redux';
import { store as reduxStore } from 'store/store';

import { checkOrigin } from './helpers/checkOrigin';
import DrawerProvider from './hooks/useWalletDrawer';
import Router from './router';

dayjs.extend(duration);

const MainApp = () => {
  useGlobalRefresh();

  return (
    <Box className="overflow-x-hidden" flex={1}>
      <div id="headlessui-portal-root" />

      <DrawerProvider>
        <Router />
      </DrawerProvider>
    </Box>
  );
};

function App() {
  if (!checkOrigin()) return null;

  return (
    <ReduxProvider store={reduxStore}>
      <ThemeProvider>
        <AnnouncementsProvider>
          <MainApp />
        </AnnouncementsProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}

export default App;
