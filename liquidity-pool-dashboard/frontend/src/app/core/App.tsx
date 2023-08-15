import React from 'react'

import { CoreRouter } from 'app/core/routes'

import ErrorBoundary from './error-boundary'

const App = (): JSX.Element => (
  <ErrorBoundary displayMessage="Ooooppss... An unexpected error occured">
    <CoreRouter />
  </ErrorBoundary>
)

export default App
