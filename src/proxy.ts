import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Redis } from 'ioredis';
import { Ratelimit } from '@upstash/ratelimit';

// Initialize Redis client
const redis = new Redis({
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: 1
});

// Simple rate limiter
const ratelimit = {
  limit: async (key: string) => {
    try {
      const current = await redis.incr(key);
      await redis.expire(key, 60);
      
      const limit = Number(process.env.RATE_LIMIT_MAX) || 100;
      const remaining = Math.max(0, limit - current);
      
      return {
        success: current <= limit,
        limit,
        remaining,
        reset: Date.now() + 60000
      };
    } catch (error) {
      console.error('Rate limiting error:', error);
      return {
        success: true,
        limit: 100,
        remaining: 99,
        reset: Date.now() + 60000
      };
    }
  }
};

export async function proxy(request: NextRequest) {
  // Get IP from headers or fall back to a default
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             '127.0.0.1';
  
  // Only rate limit API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    try {
      const { success, limit, reset, remaining } = await ratelimit.limit(`ratelimit_${ip}`);

      if (!success) {
        return new NextResponse('Too Many Requests', {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          },
        });
      }
    } catch (error) {
      console.error('Rate limiting error:', error);
    }
  }

  // CORS headers
  const response = NextResponse.next();
  const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',');
  const origin = request.headers.get('origin');

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');
  }

  // Security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: *.googletagmanager.com; font-src 'self' data:; connect-src 'self' *.data.gov.in;"
  );

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};