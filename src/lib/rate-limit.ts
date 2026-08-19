// src/lib/rate-limit.ts
// A simple in-memory rate limiter for Next.js App Router API Routes.

type RateLimitRecord = {
  count: number;
  resetTime: number;
};

const rateLimits = new Map<string, RateLimitRecord>();

export function rateLimit(ip: string, maxRequests: number, windowMs: number) {
  const now = Date.now();
  const record = rateLimits.get(ip);

  if (!record) {
    rateLimits.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { success: true, remaining: maxRequests - 1, reset: now + windowMs };
  }

  // If window has passed, reset
  if (now > record.resetTime) {
    rateLimits.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { success: true, remaining: maxRequests - 1, reset: now + windowMs };
  }

  // Check limits
  if (record.count >= maxRequests) {
    return { success: false, remaining: 0, reset: record.resetTime };
  }

  // Increment counter
  record.count += 1;
  return { success: true, remaining: maxRequests - record.count, reset: record.resetTime };
}
