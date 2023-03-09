import 'chart.js/auto';

import { Box, Icon } from 'components/Atomic';
import { Layout } from 'components/Layout';
import { ToastPortal } from 'components/Toast';
import { lazy, memo, Suspense } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { IS_PROD } from 'settings/config';
import { ROUTES } from 'settings/router';

const Swap = lazy(() => import('views/Swap'));
const WalletBalance = lazy(() => import('views/WalletBalance'));
const Earn = lazy(() => import('views/Earn'));
const Multisig = lazy(() => import('views/Multisig/Multisig'));
const TxBuilder = lazy(() => import('views/Multisig/TxBuilder/TxBuilder'));
const TxCreate = lazy(() => import('views/Multisig/TxCreate/TxCreate'));
const TxImport = lazy(() => import('views/Multisig/TxImport/TxImport'));
const TxMultisig = lazy(() => import('views/Multisig/TxMultisig/TxMultisig'));
const AddLiquidity = lazy(() => import('views/AddLiquidity'));
const CreateLiquidity = lazy(() => import('views/CreateLiquidity'));
const Home = lazy(() => import('views/Home'));
const Liquidity = lazy(() => import('views/Liquidity'));
const NodeDetails = lazy(() => import('views/Nodes/NodeDetails'));
const NodeManager = lazy(() => import('views/Nodes/NodeManager'));
const Nodes = lazy(() => import('views/Nodes'));
const Send = lazy(() => import('views/Send'));
const LegacyStake = lazy(() => import('views/LegacyStake'));
const StakeVThor = lazy(() => import('views/StakeVThor'));
const Thorname = lazy(() => import('views/Thorname'));
const UpgradeRune = lazy(() => import('views/UpgradeRune'));
const Vesting = lazy(() => import('views/Vesting'));
const Wallet = lazy(() => import('views/Wallet'));
const WithdrawLiquidity = lazy(() => import('views/WithdrawLiquidity'));
const OnRamp = lazy(() => import('views/OnRamp'));
const MultisigCreate = lazy(() => import('views/Multisig/MultisigCreate/MultisigCreate'));
const MultisigImport = lazy(() => import('views/Multisig/MultisigImport/MultisigImport'));

export type RouteType = {
  path: string;
  element: NotWorth;
}[];

const NOT_PROD_ROUTES = IS_PROD ? [] : [];

const routes: RouteType = [
  { path: ROUTES.AddLiquidity, element: AddLiquidity },
  { path: ROUTES.AddLiquidityPool, element: AddLiquidity },
  { path: ROUTES.CreateLiquidity, element: CreateLiquidity },
  { path: ROUTES.Earn, element: Earn },
  { path: ROUTES.Home, element: Home },
  { path: ROUTES.LegacyStake, element: LegacyStake },
  { path: ROUTES.Kyber, element: Swap },
  { path: ROUTES.KyberPair, element: Swap },
  { path: ROUTES.Liquidity, element: Liquidity },
  { path: ROUTES.Multisig, element: Multisig },
  { path: ROUTES.MultisigConnect, element: MultisigImport },
  { path: ROUTES.MultisigCreate, element: MultisigCreate },
  { path: ROUTES.NodeDetail, element: NodeDetails },
  { path: ROUTES.NodeDetail, element: NodeDetails },
  { path: ROUTES.NodeManager, element: NodeManager },
  { path: ROUTES.NodeManager, element: NodeManager },
  { path: ROUTES.Nodes, element: Nodes },
  { path: ROUTES.Nodes, element: Nodes },
  { path: ROUTES.OnRamp, element: OnRamp },
  { path: ROUTES.Send, element: Send },
  { path: ROUTES.SendAsset, element: Send },
  { path: ROUTES.Stake, element: StakeVThor },
  { path: ROUTES.Swap, element: Swap },
  { path: ROUTES.SwapPair, element: Swap },
  { path: ROUTES.Thorname, element: Thorname },
  { path: ROUTES.TxBuilder, element: TxBuilder },
  { path: ROUTES.TxCreate, element: TxCreate },
  { path: ROUTES.TxCreatePool, element: TxCreate },
  { path: ROUTES.TxImport, element: TxImport },
  { path: ROUTES.TxMultisig, element: TxMultisig },
  { path: ROUTES.UpgradeRune, element: UpgradeRune },
  { path: ROUTES.Vesting, element: Vesting },
  { path: ROUTES.Vesting, element: Vesting },
  { path: ROUTES.Wallet, element: Wallet },
  { path: ROUTES.WithdrawLiquidity, element: WithdrawLiquidity },
  { path: ROUTES.WithdrawLiquidityPool, element: WithdrawLiquidity },
  ...NOT_PROD_ROUTES,
];

export const PublicRoutes = memo(() => {
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
});
