
// Admin Security Configuration
// IMPORTANT: In production, these should be environment variables or stored securely

export const ADMIN_SECURITY_CONFIG = {
  // Authorized admin emails - only these emails can access admin functions
  AUTHORIZED_EMAILS: [
    'admin@partmatchgh.com',
    'administrator@partmatchgh.com',
    'eric777arthur@gmail.com',
    'eric.arthur@partmatchgh.com',
    'j777wmb@gmail.com'
    // Add your specific admin emails here
    // Never use common emails like admin@domain.com
  ],
  
  // Development mode flag - MUST be false in production
  DEVELOPMENT_MODE: true, // Set to false for production security
  
  // Minimum password requirements for admin accounts
  PASSWORD_REQUIREMENTS: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  },
  
  // Session security settings
  SESSION_CONFIG: {
    maxInactiveTime: 30 * 60 * 1000, // 30 minutes in milliseconds
    requireReauthForSensitiveActions: true
  }
};

// Validate if an email is authorized for admin access
export const isAuthorizedAdminEmail = (email: string): boolean => {
  if (ADMIN_SECURITY_CONFIG.DEVELOPMENT_MODE) {
    console.warn('🔧 DEVELOPMENT MODE: Allowing admin access for any email:', email);
    return true;
  }
  
  // Strict email validation for production
  const normalizedEmail = email.toLowerCase().trim();
  const isAuthorized = ADMIN_SECURITY_CONFIG.AUTHORIZED_EMAILS.includes(normalizedEmail);
  
  if (!isAuthorized) {
    console.error('🚫 SECURITY: Unauthorized admin access attempt for email:', email);
    logAdminSecurityEvent({
      type: 'UNAUTHORIZED_ACCESS',
      email: email,
      details: 'Attempted admin access with unauthorized email'
    });
  }
  
  return isAuthorized;
};

// Validate admin password strength
export const validateAdminPassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const { PASSWORD_REQUIREMENTS } = ADMIN_SECURITY_CONFIG;
  
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`);
  }
  
  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (PASSWORD_REQUIREMENTS.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (PASSWORD_REQUIREMENTS.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Log admin security events (in production, send to secure logging service)
export const logAdminSecurityEvent = (event: {
  type: 'LOGIN_ATTEMPT' | 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'UNAUTHORIZED_ACCESS' | 'ADMIN_ACTION';
  email?: string;
  userId?: string;
  details?: string;
  timestamp?: Date;
}) => {
  const logEntry = {
    ...event,
    timestamp: event.timestamp || new Date(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown',
    ip: 'Not available in client-side' // In production, capture this server-side
  };
  
  console.warn('🔒 ADMIN SECURITY EVENT:', logEntry);
  
  // In production, send this to your secure logging service
  // Example: await fetch('/api/admin-security-log', { method: 'POST', body: JSON.stringify(logEntry) });
};
