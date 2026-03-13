/**
 * Sentry Error Monitoring Setup
 *
 * To enable:
 * 1. npm install @sentry/nextjs
 * 2. Set NEXT_PUBLIC_SENTRY_DSN in .env
 * 3. Uncomment the Sentry initialization below
 *
 * For now, we use a lightweight error tracking layer that logs to console
 * and can be upgraded to Sentry when ready.
 */

interface ErrorContext {
  userId?: string
  projectId?: string
  action?: string
  extra?: Record<string, unknown>
}

class ErrorTracker {
  private dsn: string | null = null
  private errors: Array<{ error: Error; context: ErrorContext; timestamp: Date }> = []

  init(dsn?: string) {
    this.dsn = dsn || process.env.NEXT_PUBLIC_SENTRY_DSN || null
    if (this.dsn) {
      console.log('[Monitoring] Error tracking initialized')
    }
  }

  captureException(error: Error, context: ErrorContext = {}) {
    const entry = { error, context, timestamp: new Date() }
    this.errors.push(entry)

    // Keep last 100 errors in memory
    if (this.errors.length > 100) {
      this.errors = this.errors.slice(-100)
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[Error Tracker]', {
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 3).join('\n'),
        ...context,
      })
    }

    // If Sentry DSN is configured, it would send here
    // Sentry.captureException(error, { extra: context })
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${level.toUpperCase()}]`, message)
    }
  }

  setUser(userId: string, email?: string) {
    // Sentry.setUser({ id: userId, email })
    if (process.env.NODE_ENV === 'development') {
      console.log('[Monitoring] User set:', userId)
    }
  }

  getRecentErrors() {
    return this.errors.slice(-20)
  }
}

export const errorTracker = new ErrorTracker()

// Initialize on module load
errorTracker.init()

/**
 * Wrap an async function with error tracking
 */
export function withErrorTracking<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  context: ErrorContext = {}
): T {
  return (async (...args: unknown[]) => {
    try {
      return await fn(...args)
    } catch (error) {
      errorTracker.captureException(
        error instanceof Error ? error : new Error(String(error)),
        context
      )
      throw error
    }
  }) as T
}
