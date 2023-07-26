import * as Sentry from '@sentry/react'
import React from 'react'
import { createRoot } from 'react-dom/client'

import reportWebVitals from './config/reportWebVitals'
import App from 'app/core/App'

import MySorobanReactProvider from './soroban/provider';

import './index.css'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
  enabled: import.meta.env.PROD,
})

// this is the recommendation of the React docs
// ref: https://react.dev/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MySorobanReactProvider>
      <App />
    </MySorobanReactProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
