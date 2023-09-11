import React from 'react'
import { RouteChildrenProps, RouteComponentProps } from 'react-router'

import * as H from 'history'

export type RouteProps = {
  location?: H.Location
  component: // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  | React.ComponentType<RouteComponentProps<any>>
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  | React.ComponentType<any>
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  | React.FunctionComponent<any>
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  render?: (props: RouteComponentProps<any>) => React.ReactNode
  children?: // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  ((props: RouteChildrenProps<any>) => React.ReactNode) | React.ReactNode
  path?: string
  exact?: boolean
  sensitive?: boolean
  strict?: boolean
}

export interface IAppRoute {
  component: // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  | React.ComponentType<RouteComponentProps<any>>
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  | React.ComponentType<any>
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  | React.FunctionComponent<any>
  path: string
  exact?: boolean
  isPrivate?: boolean
}

export interface IModuleRouteProps {
  routePrefix?: string
  routes: IAppRoute[]
  isAuthenticated: () => boolean
}
