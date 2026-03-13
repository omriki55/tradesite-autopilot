/**
 * In-memory rate limiter for API routes
 * For production at scale, replace with Redis-based solution
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}, 5 * 60 * 1000)

interface RateLimitConfig {
  /** Max requests per window */
  limit: number
  /** Window duration in seconds */
  windowSeconds: number
}

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetAt: number
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { limit: 60, windowSeconds: 60 }
): RateLimitResult {
  const now = Date.now()
  const key = identifier
  const entry = rateLimitMap.get(key)

  if (!entry || now > entry.resetTime) {
    // New window
    const resetTime = now + config.windowSeconds * 1000
    rateLimitMap.set(key, { count: 1, resetTime })
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      resetAt: resetTime,
    }
  }

  if (entry.count >= config.limit) {
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      resetAt: entry.resetTime,
    }
  }

  entry.count++
  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - entry.count,
    resetAt: entry.resetTime,
  }
}

/**
 * Rate limit presets
 */
export const RATE_LIMITS = {
  /** Auth endpoints: 10 requests per minute */
  auth: { limit: 10, windowSeconds: 60 },
  /** API endpoints: 60 requests per minute */
  api: { limit: 60, windowSeconds: 60 },
  /** AI generation: 5 requests per minute */
  ai: { limit: 5, windowSeconds: 60 },
  /** File upload: 10 per minute */
  upload: { limit: 10, windowSeconds: 60 },
} as const
