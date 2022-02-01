import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from 'views/Home'

import { Layout } from 'components/Layout'

import { HOME_ROUTE } from 'settings/constants'

export type RouteType = {
  path?: string
  element?: FixMe
}[]

const routes: RouteType = [
  {
    path: HOME_ROUTE,
    element: Home,
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
