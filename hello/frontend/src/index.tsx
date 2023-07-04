import reportWebVitals from "./config/reportWebVitals";
import "./index.css";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import App from "app/core/App";
import React from "react";
import ReactDOM from "react-dom";
import MySorobanReactProvider from "soroban/MySorobanReactProvider";


Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
  enabled: process.env.NODE_ENV === "production",
});

ReactDOM.render(
  <React.StrictMode>
    <MySorobanReactProvider>
      <App />
    </MySorobanReactProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();