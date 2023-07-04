import React from 'react'
import { Route } from 'react-router-dom'

import { RouteProps } from '../types'

const PublicRoute = (props: RouteProps): JSX.Element => <Route {...props} />

export default PublicRoute
