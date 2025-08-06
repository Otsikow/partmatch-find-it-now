// Shared CORS configuration for Supabase Edge Functions

interface CorsConfig {
  allowedOrigins: string[];
  allowedHeaders: string[];
  credentials: boolean;
}

// Production CORS - restrict to specific domains
const PRODUCTION_ORIGINS = [
  'https://partmatch.app',
  'https://www.partmatch.app',
  'https://da5f3cd3-68ef-4174-8020-511e0e3ffc08.lovableproject.com'
];

// Development CORS - allow localhost for testing
const DEVELOPMENT_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  ...PRODUCTION_ORIGINS
];

export function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('origin');
  const isDevelopment = Deno.env.get('DENO_DEPLOYMENT_ID') === undefined;
  
  const allowedOrigins = isDevelopment ? DEVELOPMENT_ORIGINS : PRODUCTION_ORIGINS;
  
  // Check if origin is allowed
  let allowedOrigin = 'https://partmatch.app'; // Default fallback
  
  if (origin && allowedOrigins.includes(origin)) {
    allowedOrigin = origin;
  }

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

export function isOriginAllowed(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  
  const isDevelopment = Deno.env.get('DENO_DEPLOYMENT_ID') === undefined;
  const allowedOrigins = isDevelopment ? DEVELOPMENT_ORIGINS : PRODUCTION_ORIGINS;
  
  return allowedOrigins.includes(origin);
}

// Rate limiting helper
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string, 
  maxRequests: number = 60, 
  windowMs: number = 60000
): { allowed: boolean; remainingRequests: number } {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Clean up old entries
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < windowStart) {
      rateLimitMap.delete(key);
    }
  }
  
  const current = rateLimitMap.get(identifier);
  
  if (!current || current.resetTime < windowStart) {
    // First request in window or window expired
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remainingRequests: maxRequests - 1 };
  }
  
  if (current.count >= maxRequests) {
    return { allowed: false, remainingRequests: 0 };
  }
  
  current.count++;
  return { allowed: true, remainingRequests: maxRequests - current.count };
}