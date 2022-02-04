import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import HomeView from 'views/Home'
import NodesView from 'views/Nodes'
import StatsView from 'views/Stats/Stats'

import { Layout } from 'components/Layout'

import { HOME_ROUTE, STATS_ROUTE, NODES_ROUTE } from 'settings/constants'

export type RouteType = {
  path?: string
  element?: FixMe
}[]

const routes: RouteType = [
  {
    path: HOME_ROUTE,
    element: HomeView,
  },
  {
    path: STATS_ROUTE,
    element: StatsView,
  },
  {
    path: NODES_ROUTE,
    element: NodesView,
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
