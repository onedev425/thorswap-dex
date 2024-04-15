import 'chart.js/auto';

import { Box, Icon } from 'components/Atomic';
import { EggHunt } from 'components/easter/EggHunt';
import { Layout } from 'components/Layout';
import { ToastPortal } from 'components/Toast';
import { isIframe } from 'helpers/isIframe';
import { lazy, memo, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from 'settings/router';
import { actions } from 'store/app/slice';
import { useAppDispatch } from 'store/store';
import { ToSView } from 'views/ToS';
import * as z from 'zod';

const Swap = lazy(() => import('views/Swap'));
const WalletBalance = lazy(() => import('views/WalletBalance'));
const Earn = lazy(() => import('views/Earn'));
const Lending = lazy(() => import('views/Lending'));
const Multisig = lazy(() => import('views/Multisig/Multisig'));
const TxBuilder = lazy(() => import('views/Multisig/TxBuilder/TxBuilder'));
const TxCreate = lazy(() => import('views/Multisig/TxCreate/TxCreate'));
const TxImport = lazy(() => import('views/Multisig/TxImport/TxImport'));
const TxMultisig = lazy(() => import('views/Multisig/TxMultisig/TxMultisig'));
const AddLiquidity = lazy(() => import('views/AddLiquidity'));
const CreateLiquidity = lazy(() => import('views/CreateLiquidity'));
const Home = lazy(() => import('views/Home'));
const NodeDetails = lazy(() => import('views/Nodes/NodeDetails'));
const NodeManager = lazy(() => import('views/Nodes/NodeManager'));
const Nodes = lazy(() => import('views/Nodes'));
const Send = lazy(() => import('views/Send'));
const LegacyStake = lazy(() => import('views/LegacyStake'));
const Staking = lazy(() => import('views/Staking'));
const Thorname = lazy(() => import('views/Thorname'));
const Vesting = lazy(() => import('views/Vesting'));
const Wallet = lazy(() => import('views/Wallet'));
const MultisigCreate = lazy(() => import('views/Multisig/MultisigCreate/MultisigCreate'));
const MultisigImport = lazy(() => import('views/Multisig/MultisigImport/MultisigImport'));
const Transaction = lazy(() => import('views/Transaction/Transaction'));

// New LP
const Liquidity = lazy(() => import('views/new-liquidity'));
const WithdrawLiquidity = lazy(() => import('views/withdraw-liquidity'));

export type RouteType = {
  path: string;
  element: NotWorth;
}[];

const commonRoutes = [
  { path: ROUTES.Swap, element: Swap },
  { path: ROUTES.SwapPair, element: Swap },
  { path: ROUTES.Okx, element: Swap },
  { path: ROUTES.OkxPair, element: Swap },
  { path: ROUTES.Transaction, element: Transaction },
  { path: ROUTES.TxBuilder, element: TxBuilder },
  { path: ROUTES.TxCreate, element: TxCreate },
  { path: ROUTES.TxCreatePool, element: TxCreate },
  { path: ROUTES.TxImport, element: TxImport },
  { path: ROUTES.TxMultisig, element: TxMultisig },
  { path: ROUTES.ToS, element: ToSView },
];

const routes: RouteType = isIframe()
  ? commonRoutes
  : [
      ...commonRoutes,
      { path: ROUTES.AddLiquidity, element: AddLiquidity },
      { path: ROUTES.AddLiquidityPool, element: AddLiquidity },
      { path: ROUTES.CreateLiquidity, element: CreateLiquidity },
      { path: ROUTES.Earn, element: Earn },
      { path: ROUTES.EarnAsset, element: Earn },
      { path: ROUTES.Home, element: Home },
      { path: ROUTES.LegacyStake, element: LegacyStake },
      { path: ROUTES.Lending, element: Lending },
      { path: ROUTES.LendingAsset, element: Lending },
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
      { path: ROUTES.Send, element: Send },
      { path: ROUTES.SendAsset, element: Send },
      { path: ROUTES.Stake, element: Staking },
      { path: ROUTES.Thorname, element: Thorname },
      { path: ROUTES.Vesting, element: Vesting },
      { path: ROUTES.Wallet, element: Wallet },
      { path: ROUTES.WithdrawLiquidity, element: WithdrawLiquidity },
      { path: ROUTES.WithdrawLiquidityPool, element: WithdrawLiquidity },
    ];

const iframeParamsSchema = z.object({
  fee: z.number().int().positive(),
  address: z.string().min(1),
  basePair: z.string(),
  logoUrl: z.string(),
});

export const PublicRoutes = memo(() => {
  const appDispatch = useAppDispatch();
  useEffect(() => {
    if (isIframe()) {
      if (!window.location.search) {
        throw new Error('Invalid iframe');
      }

      const params = new URLSearchParams(window.location.search);
      const values = {
        fee: Number.parseInt(params.get('fee') ?? '50', 10),
        address: params.get('address') ?? 't',
        basePair: params.get('basePair') ?? '',
        logoUrl: params.get('logoUrl') ?? '',
      };
      try {
        const iframeParams = iframeParamsSchema.parse(values);

        appDispatch(actions.setIframeData(iframeParams));
      } catch (error) {
        throw new Error('Invalid iframe');
      }
    }
  }, [appDispatch]);

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
                      <EggHunt />
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
