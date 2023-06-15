import Home from 'app/core/pages/home'

import { IAppRoute } from './types'

export const coreRoutes: IAppRoute[] = [
  { path: '/', exact: true, component: Home },
  { path: '/private', exact: true, component: Home, isPrivate: true },
]
