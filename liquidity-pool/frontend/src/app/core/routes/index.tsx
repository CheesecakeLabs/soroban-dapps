import React from 'react'
import { BrowserRouter as Router, Switch } from 'react-router-dom'

import { isAuthentication } from 'app/core/auth'

import ModuleRoutes from './module-routes'
import { coreRoutes } from './routes'

const CoreRouter = (): JSX.Element => (
  <Router>
    <Switch>
      <ModuleRoutes routes={coreRoutes} isAuthenticated={isAuthentication} />
    </Switch>
  </Router>
)

export { CoreRouter }
