// **Step 7: Modular Country Configuration**

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'mobile_money' | 'card' | 'bank_transfer' | 'crypto';
  icon?: string;
  provider?: string;
}

export interface CountryConfig {
  code: string;
  name: string;
  currency: string;
  flag: string;
  languages: string[];
  paymentMethods: PaymentMethod[];
  timezonе?: string;
  phonePrefix: string;
  regions: string[];
  popularCities: string[];
}

export const COUNTRY_CONFIGS: Record<string, CountryConfig> = {
  GH: {
    code: 'GH',
    name: 'Ghana',
    currency: 'GHS',
    flag: '🇬🇭',
    languages: ['en', 'tw'],
    phonePrefix: '+233',
    regions: ['Greater Accra', 'Ashanti', 'Western', 'Central', 'Eastern', 'Volta', 'Northern', 'Upper East', 'Upper West', 'Brong Ahafo'],
    popularCities: ['Accra', 'Kumasi', 'Tamale', 'Takoradi', 'Cape Coast', 'Sunyani', 'Koforidua', 'Ho', 'Wa', 'Bolgatanga'],
    paymentMethods: [
      { id: 'mtn-momo', name: 'MTN Mobile Money', type: 'mobile_money', provider: 'MTN', icon: '📱' },
      { id: 'vodafone-cash', name: 'Vodafone Cash', type: 'mobile_money', provider: 'Vodafone', icon: '📱' },
      { id: 'airtel-money', name: 'AirtelTigo Money', type: 'mobile_money', provider: 'AirtelTigo', icon: '📱' },
      { id: 'paystack-gh', name: 'Paystack (Card)', type: 'card', provider: 'Paystack', icon: '💳' },
      { id: 'bank-transfer-gh', name: 'Bank Transfer', type: 'bank_transfer', icon: '🏦' },
    ]
  },
  NG: {
    code: 'NG',
    name: 'Nigeria',
    currency: 'NGN',
    flag: '🇳🇬',
    languages: ['en', 'yo'],
    phonePrefix: '+234',
    regions: ['Lagos', 'Kano', 'Rivers', 'Kaduna', 'Oyo', 'Delta', 'Abuja FCT', 'Anambra', 'Imo', 'Plateau'],
    popularCities: ['Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt', 'Benin City', 'Kaduna', 'Jos', 'Ilorin', 'Onitsha'],
    paymentMethods: [
      { id: 'paystack-ng', name: 'Paystack', type: 'card', provider: 'Paystack', icon: '💳' },
      { id: 'flutterwave', name: 'Flutterwave', type: 'card', provider: 'Flutterwave', icon: '💳' },
      { id: 'opay', name: 'OPay', type: 'mobile_money', provider: 'OPay', icon: '📱' },
      { id: 'palmpay', name: 'PalmPay', type: 'mobile_money', provider: 'PalmPay', icon: '📱' },
      { id: 'bank-transfer-ng', name: 'Bank Transfer', type: 'bank_transfer', icon: '🏦' },
      { id: 'ussd', name: 'USSD Payment', type: 'mobile_money', icon: '📞' },
    ]
  },
  KE: {
    code: 'KE',
    name: 'Kenya',
    currency: 'KES',
    flag: '🇰🇪',
    languages: ['en', 'sw'],
    phonePrefix: '+254',
    regions: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 'Kitale', 'Garissa', 'Kakamega'],
    popularCities: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 'Kitale', 'Garissa', 'Kakamega'],
    paymentMethods: [
      { id: 'mpesa', name: 'M-Pesa', type: 'mobile_money', provider: 'Safaricom', icon: '📱' },
      { id: 'airtel-money-ke', name: 'Airtel Money', type: 'mobile_money', provider: 'Airtel', icon: '📱' },
      { id: 'tkash', name: 'T-Kash', type: 'mobile_money', provider: 'Telkom', icon: '📱' },
      { id: 'card-ke', name: 'Credit/Debit Card', type: 'card', icon: '💳' },
      { id: 'bank-transfer-ke', name: 'Bank Transfer', type: 'bank_transfer', icon: '🏦' },
    ]
  },
  ZA: {
    code: 'ZA',
    name: 'South Africa',
    currency: 'ZAR',
    flag: '🇿🇦',
    languages: ['en'],
    phonePrefix: '+27',
    regions: ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Limpopo', 'Mpumalanga', 'North West', 'Free State', 'Northern Cape'],
    popularCities: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein', 'East London', 'Nelspruit', 'Polokwane', 'Kimberley'],
    paymentMethods: [
      { id: 'eft-za', name: 'EFT Bank Transfer', type: 'bank_transfer', icon: '🏦' },
      { id: 'card-za', name: 'Credit/Debit Card', type: 'card', icon: '💳' },
      { id: 'payfast', name: 'PayFast', type: 'card', provider: 'PayFast', icon: '💳' },
      { id: 'snapscan', name: 'SnapScan', type: 'mobile_money', provider: 'SnapScan', icon: '📱' },
    ]
  },
  UG: {
    code: 'UG',
    name: 'Uganda',
    currency: 'UGX',
    flag: '🇺🇬',
    languages: ['en', 'sw'],
    phonePrefix: '+256',
    regions: ['Central', 'Eastern', 'Northern', 'Western'],
    popularCities: ['Kampala', 'Gulu', 'Lira', 'Mbarara', 'Jinja', 'Mbale', 'Mukono', 'Kasese', 'Masaka', 'Entebbe'],
    paymentMethods: [
      { id: 'mtn-momo-ug', name: 'MTN Mobile Money', type: 'mobile_money', provider: 'MTN', icon: '📱' },
      { id: 'airtel-money-ug', name: 'Airtel Money', type: 'mobile_money', provider: 'Airtel', icon: '📱' },
      { id: 'card-ug', name: 'Credit/Debit Card', type: 'card', icon: '💳' },
      { id: 'bank-transfer-ug', name: 'Bank Transfer', type: 'bank_transfer', icon: '🏦' },
    ]
  },
};

// Helper functions
export const getCountryConfig = (countryCode: string): CountryConfig | null => {
  return COUNTRY_CONFIGS[countryCode] || null;
};

export const getCountryByName = (countryName: string): CountryConfig | null => {
  return Object.values(COUNTRY_CONFIGS).find(config => config.name === countryName) || null;
};

export const getPaymentMethodsForCountry = (countryCode: string): PaymentMethod[] => {
  const config = getCountryConfig(countryCode);
  return config?.paymentMethods || [];
};

export const getSupportedCountries = (): CountryConfig[] => {
  return Object.values(COUNTRY_CONFIGS);
};

export const getCurrencyByCountry = (countryCode: string): string => {
  const config = getCountryConfig(countryCode);
  return config?.currency || 'USD';
};

export const getLanguagesByCountry = (countryCode: string): string[] => {
  const config = getCountryConfig(countryCode);
  return config?.languages || ['en'];
};

// Update the existing SUPPORTED_COUNTRIES to use this config
export const SUPPORTED_COUNTRIES = getSupportedCountries().map(config => ({
  code: config.code,
  name: config.name,
  currency: config.currency,
  flag: config.flag
}));