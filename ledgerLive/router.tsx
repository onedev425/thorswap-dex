import 'chart.js/auto';

import { Box, Icon } from 'components/Atomic';
import { Layout } from 'components/Layout';
import { ToastPortal } from 'components/Toast';
import { lazy, memo, Suspense } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from 'settings/router';
import Swap from 'views/Swap';
import WalletBalance from 'views/WalletBalance';

const Transaction = lazy(() => import('views/Transaction/Transaction'));

export type RouteType = {
  path: string;
  element: NotWorth;
}[];

const routes: RouteType = [
  { path: ROUTES.Swap, element: Swap },
  { path: ROUTES.SwapPair, element: Swap },
  { path: ROUTES.Transaction, element: Transaction },
];

export const PublicRoutes = () => {
  return (
    <Router>
      <Routes>
        {routes.map((route) => {
          const Component = route.element;

          return (
            <Route
              element={
                <>
                  <WalletBalance />

                  <Layout>
                    <Suspense
                      fallback={
                        <Box center className="p-10" flex={1}>
                          <Icon spin name="loader" size={32} />
                        </Box>
                      }
                    >
                      <Component />
                    </Suspense>
                  </Layout>
                </>
              }
              key={route.path}
              path={route.path}
            />
          );
        })}

        <Route element={<Navigate to="/swap" />} path="*" />
      </Routes>
      <ToastPortal />
    </Router>
  );
};

export default memo(PublicRoutes);
