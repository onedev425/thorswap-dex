import { captureException, withProfiler } from '@sentry/react';
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
import type { PropsWithChildren } from 'react';
import { Component } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { IS_LOCAL, IS_PROD } from 'settings/config';
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

class ErrorBoundary extends Component<PropsWithChildren<{}>, { hasError: boolean }> {
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: any, info: any) {
    const retryCount = parseInt(localStorage.getItem('errorRetryCount') || '0');
    const errorName = error.toString();
    const errorMessage = error?.message;

    if (retryCount < 2) return;
    localStorage.setItem('errorRetryCount', `${retryCount + 1}`);

    const importedModuleNotFound =
      errorMessage?.includes('Failed to load module script') ||
      errorName?.includes('Failed to load module script');
    const importedDynamicModuleNotFound =
      errorMessage?.includes('Failed to fetch dynamically imported module') ||
      errorName?.includes('Failed to fetch dynamically imported module');

    if (!IS_PROD && !IS_LOCAL && (importedModuleNotFound || importedDynamicModuleNotFound)) {
      alert(
        'Developer here! We just released new version which deprecates old version of page :(\n Your page has been reloaded to get new version. Sorry for inconvenience!',
      );
      return window.location.reload();
    }

    localStorage.removeItem('errorRetryCount');
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    captureException(error, info);
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

const AppProviders = () => {
  if (!checkOrigin()) return null;

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};

export const App = withProfiler(AppProviders);
