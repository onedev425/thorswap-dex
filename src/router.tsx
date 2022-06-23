import { memo } from 'react'

import {
  Navigate,
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'

import AddLiquidity from 'views/AddLiquidity'
import CreateLiquidity from 'views/CreateLiquidity'
import Home from 'views/Home'
import Liquidity from 'views/Liquidity'
import Nodes from 'views/Nodes'
import NodeDetails from 'views/Nodes/NodeDetails'
import NodeManager from 'views/Nodes/NodeManager'
import Send from 'views/Send'
import Stake from 'views/Stake'
import StakeVThor from 'views/StakeVThor'
import Swap from 'views/Swap'
import Thorname from 'views/Thorname'
import UpgradeRune from 'views/UpgradeRune'
import Vesting from 'views/Vesting'
import Wallet from 'views/Wallet'
import WalletBalance, { WalletDrawer } from 'views/WalletBalance'
import WithdrawLiquidity from 'views/WithdrawLiquidity'

import { TooltipPortal } from 'components/Atomic'
import { Layout } from 'components/Layout'
import { ToastPortal } from 'components/Toast'

import { ROUTES } from 'settings/constants'

export type RouteType = {
  path: string
  element?: FixMe
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
  { path: ROUTES.Stake, element: Stake },
  { path: ROUTES.StakeV2, element: StakeVThor },
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
                    <Component />
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
