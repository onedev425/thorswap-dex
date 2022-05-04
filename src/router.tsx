import { memo, Suspense } from 'react'

import {
  Navigate,
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'

import AddLiquidity from 'views/AddLiquidity'
import CreateLiquidity from 'views/CreateLiquidity'
import Home from 'views/Home'
import ManageLiquidity from 'views/ManageLiquidity'
import Send from 'views/Send'
import Stake from 'views/Stake'
import StakeVThor from 'views/StakeVThor'
import Stats from 'views/Stats'
import Swap from 'views/Swap'
// import Thorname from 'views/Thorname'
import UpgradeRune from 'views/UpgradeRune'
import Wallet from 'views/Wallet'
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
  { path: ROUTES.AddLiquidity, element: AddLiquidity },
  { path: ROUTES.AddLiquidityPool, element: AddLiquidity },
  { path: ROUTES.CreateLiquidity, element: CreateLiquidity },
  { path: ROUTES.Home, element: Home },
  { path: ROUTES.ManageLiquidity, element: ManageLiquidity },
  { path: ROUTES.Send, element: Send },
  { path: ROUTES.SendAsset, element: Send },
  { path: ROUTES.Stake, element: Stake },
  { path: ROUTES.Stats, element: Stats },
  { path: ROUTES.Swap, element: Swap },
  { path: ROUTES.SwapPair, element: Swap },
  // { path: ROUTES.Thorname, element: Thorname },
  { path: ROUTES.UpgradeRune, element: UpgradeRune },
  { path: ROUTES.Wallet, element: Wallet },
  { path: ROUTES.WithdrawLiquidity, element: WithdrawLiquidity },
  { path: ROUTES.WithdrawLiquidityPool, element: WithdrawLiquidity },
  // { path: ROUTES.Vesting, element: Vesting },
  // { path: ROUTES.Nodes, element: Nodes },
  // { path: ROUTES.NodeManager, element: NodeManager },
  // { path: ROUTES.NodeDetail, element: NodeDetails },
  { path: ROUTES.StakeV2, element: StakeVThor },
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
                    className="transition-colors bg-light-bg-primary dark:bg-dark-bg-primary"
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

export default memo(PublicRoutes)
