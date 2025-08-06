// CORS configuration utilities for secure API access

export interface CorsConfig {
  allowedOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
  credentials: boolean;
}

// Production CORS configuration - restrict to specific domains
export const PRODUCTION_CORS: CorsConfig = {
  allowedOrigins: [
    'https://partmatch.app',
    'https://www.partmatch.app',
    'https://da5f3cd3-68ef-4174-8020-511e0e3ffc08.lovableproject.com'
  ],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'authorization',
    'x-client-info',
    'apikey',
    'content-type',
    'x-csrf-token'
  ],
  credentials: true
};

// Development CORS configuration - more permissive for testing
export const DEVELOPMENT_CORS: CorsConfig = {
  allowedOrigins: ['*'],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'authorization',
    'x-client-info',
    'apikey',
    'content-type',
    'x-csrf-token'
  ],
  credentials: false
};

// Get appropriate CORS headers based on environment
export function getCorsHeaders(origin?: string): Record<string, string> {
  const isDevelopment = import.meta.env.DEV;
  const config = isDevelopment ? DEVELOPMENT_CORS : PRODUCTION_CORS;
  
  let allowedOrigin = '*';
  
  if (!isDevelopment && origin) {
    // Check if origin is in allowed list
    if (config.allowedOrigins.includes(origin)) {
      allowedOrigin = origin;
    } else {
      // Default to first allowed origin if request origin not allowed
      allowedOrigin = config.allowedOrigins[0] || 'https://partmatch.app';
    }
  }

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': config.allowedMethods.join(', '),
    'Access-Control-Allow-Headers': config.allowedHeaders.join(', '),
    'Access-Control-Allow-Credentials': config.credentials.toString(),
    'Access-Control-Max-Age': '86400' // 24 hours
  };
}

// Validate origin against allowed list
export function isOriginAllowed(origin: string): boolean {
  const isDevelopment = import.meta.env.DEV;
  
  if (isDevelopment) {
    return true; // Allow all origins in development
  }
  
  return PRODUCTION_CORS.allowedOrigins.includes(origin);
}

// Generate CSRF token
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Validate CSRF token
export function validateCSRFToken(token: string, expectedToken: string): boolean {
  if (!token || !expectedToken) return false;
  return token === expectedToken;
}