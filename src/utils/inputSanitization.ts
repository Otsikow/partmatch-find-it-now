// Input sanitization utilities to prevent XSS and other injection attacks

// HTML sanitization using DOMPurify-like approach for client-side
export function sanitizeHtml(html: string): string {
  // Create a temporary element to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Remove potentially dangerous elements
  const dangerousElements = tempDiv.querySelectorAll('script, iframe, object, embed, form, input, meta, link');
  dangerousElements.forEach(el => el.remove());
  
  // Remove dangerous attributes
  const allElements = tempDiv.querySelectorAll('*');
  allElements.forEach(element => {
    // Remove dangerous attributes
    const dangerousAttrs = ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onblur', 'javascript:', 'data:', 'vbscript:'];
    
    Array.from(element.attributes).forEach(attr => {
      const attrName = attr.name.toLowerCase();
      const attrValue = attr.value.toLowerCase();
      
      // Remove event handlers and dangerous protocols
      if (attrName.startsWith('on') || 
          dangerousAttrs.some(dangerous => attrValue.includes(dangerous))) {
        element.removeAttribute(attr.name);
      }
    });
  });
  
  return tempDiv.innerHTML;
}

// Escape HTML entities to prevent XSS
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Sanitize and validate phone numbers
export function sanitizePhoneNumber(phone: string): string {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Validate E.164 format
  if (!/^\+[1-9]\d{1,14}$/.test(cleaned)) {
    throw new Error('Invalid phone number format. Please use international format (+1234567890)');
  }
  
  return cleaned;
}

// Sanitize email addresses
export function sanitizeEmail(email: string): string {
  const cleaned = email.trim().toLowerCase();
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleaned)) {
    throw new Error('Invalid email format');
  }
  
  return cleaned;
}

// Sanitize text input to prevent code injection
export function sanitizeText(text: string, maxLength: number = 1000): string {
  if (!text) return '';
  
  // Remove null bytes and control characters
  let cleaned = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Limit length
  if (cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength);
  }
  
  return cleaned.trim();
}

// Sanitize URLs to prevent malicious redirects
export function sanitizeUrl(url: string): string {
  if (!url) return '';
  
  try {
    const parsed = new URL(url);
    
    // Only allow safe protocols
    const allowedProtocols = ['http:', 'https:', 'mailto:'];
    if (!allowedProtocols.includes(parsed.protocol)) {
      throw new Error('Invalid URL protocol');
    }
    
    return parsed.toString();
  } catch (error) {
    throw new Error('Invalid URL format');
  }
}

// Validate and sanitize car part data
export function sanitizeCarPartData(data: any): any {
  return {
    title: sanitizeText(data.title, 100),
    description: sanitizeText(data.description, 2000),
    make: sanitizeText(data.make, 50),
    model: sanitizeText(data.model, 50),
    year: parseInt(data.year) || new Date().getFullYear(),
    part_type: sanitizeText(data.part_type, 100),
    condition: sanitizeText(data.condition, 50),
    price: parseFloat(data.price) || 0,
    currency: sanitizeText(data.currency, 10),
    location: sanitizeText(data.location, 200),
    city: sanitizeText(data.city, 100),
    country: sanitizeText(data.country, 100)
  };
}

// Validate file uploads
export function validateFileUpload(file: File): boolean {
  // Allowed image types
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  // Max file size (5MB)
  const maxSize = 5 * 1024 * 1024;
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
  }
  
  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum size is 5MB.');
  }
  
  return true;
}