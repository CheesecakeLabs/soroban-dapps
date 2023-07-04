import React from 'react'

import PrivateRoute from '../private-route'
import PublicRoute from '../public-route'
import { IModuleRouteProps } from '../types'

const ModuleRoutes = ({
  routePrefix = '',
  routes,
  isAuthenticated,
}: IModuleRouteProps): React.ReactElement => {
  return (
    <>
      {routes.map(({ component, exact, path, isPrivate = false }) => {
        const routeProps = { component, exact, path: `${routePrefix}${path}` }

        if (isPrivate) {
          return (
            <PrivateRoute
              {...routeProps}
              isAuthenticated={isAuthenticated}
              key={path}
            />
          )
        }

        return <PublicRoute {...routeProps} key={path} />
      })}
    </>
  )
}

export default ModuleRoutes
