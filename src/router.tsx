import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import AddLiquidity from 'views/AddLiquidity'
import HomeView from 'views/Home'
import ManageLiquidityView from 'views/ManageLiquidity'
import NodesView from 'views/Nodes'
import NodeManager from 'views/Nodes/NodeManager'
import PendingLiquidity from 'views/PendingLiquidity'
import SendView from 'views/Send'
import StakeView from 'views/Stake'
import StatsView from 'views/Stats'
import SwapView from 'views/Swap'
import VestingView from 'views/Vesting'
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
  { path: ROUTES.ManageLiquidity, element: ManageLiquidityView },
  { path: ROUTES.NodeManager, element: NodeManager },
  { path: ROUTES.Nodes, element: NodesView },
  { path: ROUTES.PendingLiquidity, element: PendingLiquidity },
  { path: ROUTES.Send, element: SendView },
  { path: ROUTES.Stake, element: StakeView },
  { path: ROUTES.Stats, element: StatsView },
  { path: ROUTES.Swap, element: SwapView },
  { path: ROUTES.Vesting, element: VestingView },
  { path: ROUTES.Wallet, element: WalletView },
  { path: ROUTES.WithdrawLiquidity, element: WithdrawLiquidity },
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
      </Routes>
    </Router>
  )
}

export default PublicRoutes
