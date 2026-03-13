/**
 * Input sanitization utilities
 * Protects against XSS, SQL injection, and other input-based attacks
 */

/** Remove HTML tags from a string */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '')
}

/** Escape HTML special characters */
export function escapeHtml(input: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  }
  return input.replace(/[&<>"'/]/g, (char) => map[char] || char)
}

/** Sanitize a string for safe text display */
export function sanitizeText(input: string, maxLength = 10000): string {
  if (typeof input !== 'string') return ''
  return stripHtml(input).trim().slice(0, maxLength)
}

/** Sanitize email address */
export function sanitizeEmail(input: string): string {
  if (typeof input !== 'string') return ''
  // Basic email sanitization: lowercase, trim, remove dangerous chars
  return input.toLowerCase().trim().replace(/[^a-z0-9@._+-]/g, '').slice(0, 320)
}

/** Sanitize URL - only allow http/https protocols */
export function sanitizeUrl(input: string): string {
  if (typeof input !== 'string') return ''
  const trimmed = input.trim()
  try {
    const url = new URL(trimmed)
    if (!['http:', 'https:'].includes(url.protocol)) {
      return ''
    }
    return url.toString()
  } catch {
    return ''
  }
}

/** Sanitize a slug (URL-safe string) */
export function sanitizeSlug(input: string): string {
  if (typeof input !== 'string') return ''
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 200)
}

/**
 * Sanitize object: recursively sanitize all string values in an object
 * Useful for sanitizing form data
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  maxStringLength = 10000
): T {
  const result = {} as Record<string, unknown>
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = sanitizeText(value, maxStringLength)
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = sanitizeObject(value as Record<string, unknown>, maxStringLength)
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        typeof item === 'string'
          ? sanitizeText(item, maxStringLength)
          : item && typeof item === 'object'
          ? sanitizeObject(item as Record<string, unknown>, maxStringLength)
          : item
      )
    } else {
      result[key] = value
    }
  }
  return result as T
}
