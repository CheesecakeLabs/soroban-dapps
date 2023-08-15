import Home from 'app/core/pages/home'

import { IAppRoute } from './types'
import LiquidityPool from '../pages/liquidity-pool'

export const coreRoutes: IAppRoute[] = [
  { path: '/', exact: true, component: Home },
  { path: '/liquidity-pool/:id', exact: true, component: LiquidityPool },
  { path: '/private', exact: true, component: Home, isPrivate: true },
]
