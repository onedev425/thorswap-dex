import {
  Navigate,
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'

import AddLiquidity from 'views/AddLiquidity'
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

import { Layout } from 'components/Layout'
import { WalletDrawer } from 'components/WalletDrawer'

import { ROUTES } from 'settings/constants'

export type RouteType = {
  path: string
  element?: FixMe
}[]

const routes: RouteType = [
  { path: ROUTES.AddLiquidity, element: AddLiquidity },
  { path: ROUTES.Home, element: HomeView },
  { path: ROUTES.Swap, element: SwapView },
  { path: ROUTES.Send, element: SendView },
  { path: ROUTES.SendAsset, element: SendView },
  { path: ROUTES.ManageLiquidity, element: ManageLiquidityView },
  { path: ROUTES.PendingLiquidity, element: PendingLiquidity },
  { path: ROUTES.WithdrawLiquidity, element: WithdrawLiquidity },
  { path: ROUTES.Wallet, element: WalletView },
  { path: ROUTES.Stats, element: StatsView },
  { path: ROUTES.UpgradeRune, element: UpgradeRuneView },
  // { path: ROUTES.Stake, element: StakeView },
  // { path: ROUTES.Vesting, element: VestingView },
  // { path: ROUTES.Nodes, element: Nodes },
  // { path: ROUTES.NodeManager, element: NodeManager },
  // { path: ROUTES.NodeDetail, element: NodeDetail },
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
                    <Component />
                  </Layout>
                </>
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
