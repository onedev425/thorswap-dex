import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import HomeView from 'views/Home'
import AddLiquidity from 'views/Liquidity/AddLiquidity'
import ManageLiquidityView from 'views/Liquidity/ManageLiquidity'
import WithdrawLiquidity from 'views/Liquidity/WithdrawLiquidity'
import NodesView from 'views/Nodes'
import NodeManager from 'views/Nodes/NodeManager'
import SendView from 'views/Send'
import StakeView from 'views/Stake'
import StatsView from 'views/Stats'
import SwapView from 'views/Swap'
import WalletView from 'views/Wallet'
import WalletBalance from 'views/WalletBalance'

import { Drawer } from 'components/Drawer'
import { Layout } from 'components/Layout'

import { ROUTES } from 'settings/constants'

import { useWalletDrawer } from './hooks/useWalletDrawer'

export type RouteType = {
  path: string
  element?: FixMe
}[]

const routes: RouteType = [
  { path: ROUTES.Home, element: HomeView },
  { path: ROUTES.Nodes, element: NodesView },
  { path: ROUTES.Stake, element: StakeView },
  { path: ROUTES.Stats, element: StatsView },
  { path: ROUTES.Swap, element: SwapView },
  { path: ROUTES.Send, element: SendView },
  { path: ROUTES.Wallet, element: WalletView },
  { path: ROUTES.AddLiquidity, element: AddLiquidity },
  { path: ROUTES.ManageLiquidity, element: ManageLiquidityView },
  { path: ROUTES.WithdrawLiquidity, element: WithdrawLiquidity },
  { path: ROUTES.NodeManager, element: NodeManager },
]

const PublicRoutes = () => {
  const { isVisible: isWalletDrawerVisible } = useWalletDrawer()

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
                  {isWalletDrawerVisible && (
                    <Drawer>
                      <WalletBalance />
                    </Drawer>
                  )}
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
