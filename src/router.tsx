import { lazy, memo, Suspense } from 'react'

import 'chart.js/auto'
import {
  Navigate,
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'

import Stake from 'views/Stake'
import WalletBalance, { WalletDrawer } from 'views/WalletBalance'

const AddLiquidity = lazy(() => import('views/AddLiquidity'))
const CreateLiquidity = lazy(() => import('views/CreateLiquidity'))
const Home = lazy(() => import('views/Home'))
const Liquidity = lazy(() => import('views/Liquidity'))
const Nodes = lazy(() => import('views/Nodes'))
const NodeDetails = lazy(() => import('views/Nodes/NodeDetails'))
const NodeManager = lazy(() => import('views/Nodes/NodeManager'))
const Send = lazy(() => import('views/Send'))
const StakeVThor = lazy(() => import('views/StakeVThor'))
const Swap = lazy(() => import('views/Swap'))
const Thorname = lazy(() => import('views/Thorname'))
const UpgradeRune = lazy(() => import('views/UpgradeRune'))
const Vesting = lazy(() => import('views/Vesting'))
const Wallet = lazy(() => import('views/Wallet'))
const WithdrawLiquidity = lazy(() => import('views/WithdrawLiquidity'))

import { Box, Icon, TooltipPortal } from 'components/Atomic'
import { Layout } from 'components/Layout'
import { ToastPortal } from 'components/Toast'

import { ROUTES } from 'settings/constants'

export type RouteType = {
  path: string
  element: any
}[]

const routes: RouteType = [
  { path: ROUTES.AddLiquidity, element: AddLiquidity },
  { path: ROUTES.AddLiquidityPool, element: AddLiquidity },
  { path: ROUTES.CreateLiquidity, element: CreateLiquidity },
  { path: ROUTES.Home, element: Home },
  { path: ROUTES.Liquidity, element: Liquidity },
  { path: ROUTES.NodeDetail, element: NodeDetails },
  { path: ROUTES.NodeManager, element: NodeManager },
  { path: ROUTES.Nodes, element: Nodes },
  { path: ROUTES.Send, element: Send },
  { path: ROUTES.SendAsset, element: Send },
  { path: ROUTES.LegacyStake, element: Stake },
  { path: ROUTES.Stake, element: StakeVThor },
  { path: ROUTES.Swap, element: Swap },
  { path: ROUTES.SwapPair, element: Swap },
  { path: ROUTES.Thorname, element: Thorname },
  { path: ROUTES.UpgradeRune, element: UpgradeRune },
  { path: ROUTES.Vesting, element: Vesting },
  { path: ROUTES.Wallet, element: Wallet },
  { path: ROUTES.WithdrawLiquidity, element: WithdrawLiquidity },
  { path: ROUTES.WithdrawLiquidityPool, element: WithdrawLiquidity },
]

const PublicRoutes = () => {
  return (
    <Router>
      <Routes>
        {routes.map((route) => {
          const Component = route.element

          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                <>
                  <WalletDrawer>
                    <WalletBalance />
                  </WalletDrawer>

                  <Layout>
                    <Suspense
                      fallback={
                        <Box flex={1} className="p-10" center>
                          <Icon size={32} spin name="loader" />
                        </Box>
                      }
                    >
                      <Component />
                    </Suspense>
                  </Layout>
                </>
              }
            />
          )
        })}

        <Route path="*" element={<Navigate to="/swap" />} />
      </Routes>

      <TooltipPortal />
      <ToastPortal />
    </Router>
  )
}

export default memo(PublicRoutes)
