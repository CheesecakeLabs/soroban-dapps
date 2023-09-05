import React from 'react'
import { Redirect, Route } from 'react-router-dom'

import { RouteProps } from '../types'

type PrivateRouteProps = RouteProps & {
  isAuthenticated: () => boolean
}

const PrivateRoute = ({
  component: Component,
  isAuthenticated,
  ...rest
}: PrivateRouteProps): JSX.Element => (
  <Route
    {...rest}
    render={(props): JSX.Element =>
      isAuthenticated() ? <Component {...props} /> : <Redirect to="/login" />
    }
  />
)

export default PrivateRoute
