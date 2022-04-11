import {
  Navigate,
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'

import AddLiquidity from 'views/AddLiquidity'
import CreateLiquidity from 'views/CreateLiquidity'
import HomeView from 'views/Home'
import ManageLiquidityView from 'views/ManageLiquidity'
import PendingLiquidity from 'views/PendingLiquidity'
import SendView from 'views/Send'
import StatsView from 'views/Stats'
import SwapView from 'views/Swap'
import UpgradeRuneView from 'views/UpgradeRune'
import WalletView from 'views/Wallet'
import WalletBalance from 'views/WalletBalance'
import WithdrawLiquidity from 'views/WithdrawLiquidity'

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
  )
}

export default PublicRoutes
