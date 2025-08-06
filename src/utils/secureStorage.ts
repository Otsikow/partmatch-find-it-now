// Secure storage utilities to replace localStorage for sensitive data

interface SecureData {
  value: string;
  encrypted: boolean;
  timestamp: number;
  expiresAt?: number;
}

class SecureStorage {
  private static readonly PREFIX = 'partmatch_secure_';
  private static readonly ENCRYPTION_KEY = 'partmatch_app_key'; // In production, use proper key derivation

  // Simple XOR encryption for client-side data (not cryptographically secure, but better than plain storage)
  private static encrypt(data: string): string {
    return btoa(data.split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ this.ENCRYPTION_KEY.charCodeAt(i % this.ENCRYPTION_KEY.length))
    ).join(''));
  }

  private static decrypt(encryptedData: string): string {
    return atob(encryptedData).split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ this.ENCRYPTION_KEY.charCodeAt(i % this.ENCRYPTION_KEY.length))
    ).join('');
  }

  static setItem(key: string, value: string, options: { 
    encrypt?: boolean; 
    expiresInMinutes?: number; 
  } = {}): void {
    const { encrypt = true, expiresInMinutes } = options;
    
    const secureData: SecureData = {
      value: encrypt ? this.encrypt(value) : value,
      encrypted: encrypt,
      timestamp: Date.now(),
      expiresAt: expiresInMinutes ? Date.now() + (expiresInMinutes * 60 * 1000) : undefined
    };

    try {
      localStorage.setItem(this.PREFIX + key, JSON.stringify(secureData));
    } catch (error) {
      console.error('Failed to store secure data:', error);
    }
  }

  static getItem(key: string): string | null {
    try {
      const item = localStorage.getItem(this.PREFIX + key);
      if (!item) return null;

      const secureData: SecureData = JSON.parse(item);
      
      // Check expiration
      if (secureData.expiresAt && Date.now() > secureData.expiresAt) {
        this.removeItem(key);
        return null;
      }

      return secureData.encrypted ? this.decrypt(secureData.value) : secureData.value;
    } catch (error) {
      console.error('Failed to retrieve secure data:', error);
      return null;
    }
  }

  static removeItem(key: string): void {
    localStorage.removeItem(this.PREFIX + key);
  }

  static clear(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(this.PREFIX));
    keys.forEach(key => localStorage.removeItem(key));
  }

  // Store user session data securely
  static setUserSession(sessionData: any): void {
    this.setItem('user_session', JSON.stringify(sessionData), { 
      encrypt: true, 
      expiresInMinutes: 30 // Auto-expire sessions after 30 minutes
    });
  }

  static getUserSession(): any {
    const sessionData = this.getItem('user_session');
    return sessionData ? JSON.parse(sessionData) : null;
  }

  static clearUserSession(): void {
    this.removeItem('user_session');
  }
}

export default SecureStorage;