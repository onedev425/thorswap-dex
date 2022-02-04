import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import HomeView from 'views/Home'
import NodesView from 'views/Nodes'
import StatsView from 'views/Stats/Stats'
import SwapView from 'views/Swap/Swap'

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
    path: ROUTES.Stats,
    element: StatsView,
  },
  {
    path: ROUTES.Nodes,
    element: NodesView,
  },
  {
    path: ROUTES.Swap,
    element: SwapView,
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
