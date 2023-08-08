import * as Sentry from '@sentry/react'
import { ErrorBoundaryProps as SentryErrorBoundaryProps } from '@sentry/react/types/errorboundary'

import styles from './styles.module.scss'

export type ErrorBoundaryFallback = ({
  error,
  componentStack,
  eventId,
  resetError,
  message,
}: {
  error: Error
  componentStack: string | null
  eventId: string | null
  resetError(): void
  message?: string
}) => JSX.Element

export interface IErrorBoundaryProps extends SentryErrorBoundaryProps {
  /**
   * A fallback component that gets rendered when the error boundary encounters an error.
   *
   * Needs to provide a function that returns a React Component as a valid fallback prop.
   * If a function is provided, the function will be called with the error, the component
   * stack, the eventId, an function that resets the error boundary on error and a message
   * to be displayed on error.
   *
   */
  fallback?: ErrorBoundaryFallback
  /**
   * Message to be displayed on fallback component (overwrites error message )
   */
  displayMessage?: string
  /**
   * Children component to be rendered if no error is caught
   */
  children?: React.ReactNode
}

const DefaultFallbackComponent: ErrorBoundaryFallback = ({
  error,
  componentStack,
  eventId,
  resetError,
  message,
}) => (
  <main data-testid="default-fallback">
    <div className={styles.error}>
      <p>{message}</p>
      <div>{eventId}</div>
      <div>{error.toString()}</div>
      <div>{componentStack}</div>
      <button
        onClick={(): void => {
          resetError()
        }}
      >
        Click here to reset!
      </button>
    </div>
  </main>
)

const ErrorBoundary = ({
  fallback = DefaultFallbackComponent,
  displayMessage,
  children,
  ...remainingProps
}: IErrorBoundaryProps): JSX.Element => {
  return (
    <Sentry.ErrorBoundary
      fallback={(props): JSX.Element =>
        fallback({ ...props, message: displayMessage || props.error.message })
      }
      {...remainingProps}
    >
      {children}
    </Sentry.ErrorBoundary>
  )
}

export default ErrorBoundary
