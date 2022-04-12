import React, { Suspense } from 'react'

import {
  Navigate,
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'

const AddLiquidity = React.lazy(() => import('views/AddLiquidity'))
const CreateLiquidity = React.lazy(() => import('views/CreateLiquidity'))
const HomeView = React.lazy(() => import('views/Home'))
const ManageLiquidityView = React.lazy(() => import('views/ManageLiquidity'))
const PendingLiquidity = React.lazy(() => import('views/PendingLiquidity'))
const SendView = React.lazy(() => import('views/Send'))
const StatsView = React.lazy(() => import('views/Stats'))
const SwapView = React.lazy(() => import('views/Swap'))
const UpgradeRuneView = React.lazy(() => import('views/UpgradeRune'))
const WalletView = React.lazy(() => import('views/Wallet'))
const WalletBalance = React.lazy(() => import('views/WalletBalance'))
const WithdrawLiquidity = React.lazy(() => import('views/WithdrawLiquidity'))

import { Box } from 'components/Atomic'
import { Layout } from 'components/Layout'
import { WalletDrawer } from 'components/WalletDrawer'

import { ROUTES } from 'settings/constants'

export type RouteType = {
  path: string
  element?: FixMe
}[]

const routes: RouteType = [
  { path: ROUTES.Home, element: HomeView },
  { path: ROUTES.Swap, element: SwapView },
  { path: ROUTES.SwapPair, element: SwapView },
  { path: ROUTES.CreateLiquidity, element: CreateLiquidity },
  { path: ROUTES.AddLiquidity, element: AddLiquidity },
  { path: ROUTES.AddLiquidityPool, element: AddLiquidity },
  { path: ROUTES.Send, element: SendView },
  { path: ROUTES.SendAsset, element: SendView },
  { path: ROUTES.ManageLiquidity, element: ManageLiquidityView },
  { path: ROUTES.PendingLiquidity, element: PendingLiquidity },
  { path: ROUTES.WithdrawLiquidity, element: WithdrawLiquidity },
  { path: ROUTES.WithdrawLiquidityPool, element: WithdrawLiquidity },
  { path: ROUTES.Wallet, element: WalletView },
  { path: ROUTES.Stats, element: StatsView },
  { path: ROUTES.UpgradeRune, element: UpgradeRuneView },
  // { path: ROUTES.Stake, element: StakeView },
  // { path: ROUTES.Vesting, element: VestingView },
  // { path: ROUTES.Nodes, element: Nodes },
  // { path: ROUTES.NodeManager, element: NodeManager },
  // { path: ROUTES.NodeDetail, element: NodeDetails },
]

const PublicRoutes = () => {
  return (
    <Suspense fallback={null}>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Component = route.element

            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <Box
                    flex={1}
                    className="bg-light-bg-primary dark:bg-dark-bg-primary transition-colors"
                  >
                    <WalletDrawer>
                      <WalletBalance />
                    </WalletDrawer>

                    <Layout>
                      <Component />
                    </Layout>
                  </Box>
                }
              />
            )
          })}

          <Route path="*" element={<Navigate to="/swap" />} />
        </Routes>
      </Router>
    </Suspense>
  )
}

export default PublicRoutes
