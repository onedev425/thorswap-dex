import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import HomeView from 'views/Home'
import NodesView from 'views/Nodes'
import StakeView from 'views/Stake'
import StatsView from 'views/Stats'
import SwapView from 'views/Swap'
import WalletView from 'views/Wallet'

import { Layout } from 'components/Layout'

import { ROUTES } from 'settings/constants'

export type RouteType = {
  path?: string
  element?: FixMe
}[]

const routes: RouteType = [
  {
    path: ROUTES.Home,
    element: HomeView,
  },
  {
    path: ROUTES.Nodes,
    element: NodesView,
  },
  {
    path: ROUTES.Stake,
    element: StakeView,
  },
  {
    path: ROUTES.Stats,
    element: StatsView,
  },
  {
    path: ROUTES.Swap,
    element: SwapView,
  },
  {
    path: ROUTES.Wallet,
    element: WalletView,
  },
]

const PublicRoutes = () => {
  return (
    <Router>
      <Routes>
        {routes.map((route, index) => {
          const Component = route.element

          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Component />
                </Layout>
              }
            />
          )
        })}
      </Routes>
    </Router>
  )
}

export default PublicRoutes
