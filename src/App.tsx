import { AnnouncementsProvider } from 'components/Announcements/AnnouncementsContext';
import { Box } from 'components/Atomic';
import { ThemeProvider } from 'components/Theme/ThemeContext';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useGlobalRefresh } from 'hooks/useGlobalRefresh';
import Plausible from 'plausible-tracker';
import { Provider as ReduxProvider } from 'react-redux';
import { IS_BETA, IS_DEV_API, IS_PROD } from 'settings/config';
import { store as reduxStore } from 'store/store';

import { checkOrigin } from './helpers/checkOrigin';
import DrawerProvider from './hooks/useWalletDrawer';
import Router from './router';

dayjs.extend(duration);

const prefix = IS_PROD ? 'app' : IS_BETA ? 'beta' : IS_DEV_API ? 'dev' : 'localhost';
const { enableAutoPageviews, enableAutoOutboundTracking } = Plausible({
  domain: prefix === 'localhost' ? 'development' : `${prefix}.thorswap.finance`,
});

enableAutoOutboundTracking();
enableAutoPageviews();

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
