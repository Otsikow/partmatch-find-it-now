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
  TZ: {
    code: 'TZ',
    name: 'Tanzania',
    currency: 'TZS',
    flag: '🇹🇿',
    languages: ['en', 'sw'],
    phonePrefix: '+255',
    regions: ['Dar es Salaam', 'Arusha', 'Mwanza', 'Dodoma', 'Mbeya'],
    popularCities: ['Dar es Salaam', 'Arusha', 'Mwanza', 'Dodoma', 'Mbeya', 'Tanga', 'Morogoro', 'Tabora', 'Kigoma', 'Iringa'],
    paymentMethods: [
      { id: 'vodacom-mpesa-tz', name: 'Vodacom M-Pesa', type: 'mobile_money', provider: 'Vodacom', icon: '📱' },
      { id: 'tigo-pesa', name: 'Tigo Pesa', type: 'mobile_money', provider: 'Tigo', icon: '📱' },
      { id: 'airtel-money-tz', name: 'Airtel Money', type: 'mobile_money', provider: 'Airtel', icon: '📱' },
      { id: 'card-tz', name: 'Credit/Debit Card', type: 'card', icon: '💳' },
    ]
  },
  US: {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    flag: '🇺🇸',
    languages: ['en'],
    phonePrefix: '+1',
    regions: ['California', 'Texas', 'Florida', 'New York', 'Pennsylvania', 'Illinois'],
    popularCities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'],
    paymentMethods: [
      { id: 'stripe-us', name: 'Credit/Debit Card', type: 'card', provider: 'Stripe', icon: '💳' },
      { id: 'paypal-us', name: 'PayPal', type: 'card', provider: 'PayPal', icon: '💳' },
      { id: 'apple-pay', name: 'Apple Pay', type: 'mobile_money', provider: 'Apple', icon: '📱' },
      { id: 'google-pay', name: 'Google Pay', type: 'mobile_money', provider: 'Google', icon: '📱' },
      { id: 'bank-transfer-us', name: 'Bank Transfer', type: 'bank_transfer', icon: '🏦' },
    ]
  },
  GB: {
    code: 'GB',
    name: 'United Kingdom',
    currency: 'GBP',
    flag: '🇬🇧',
    languages: ['en'],
    phonePrefix: '+44',
    regions: ['England', 'Scotland', 'Wales', 'Northern Ireland'],
    popularCities: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Sheffield', 'Bradford', 'Liverpool', 'Edinburgh', 'Bristol'],
    paymentMethods: [
      { id: 'stripe-gb', name: 'Credit/Debit Card', type: 'card', provider: 'Stripe', icon: '💳' },
      { id: 'paypal-gb', name: 'PayPal', type: 'card', provider: 'PayPal', icon: '💳' },
      { id: 'bank-transfer-gb', name: 'Bank Transfer', type: 'bank_transfer', icon: '🏦' },
    ]
  },
  IN: {
    code: 'IN',
    name: 'India',
    currency: 'INR',
    flag: '🇮🇳',
    languages: ['en', 'hi'],
    phonePrefix: '+91',
    regions: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Gujarat'],
    popularCities: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Surat', 'Jaipur'],
    paymentMethods: [
      { id: 'razorpay', name: 'Razorpay', type: 'card', provider: 'Razorpay', icon: '💳' },
      { id: 'paytm', name: 'Paytm', type: 'mobile_money', provider: 'Paytm', icon: '📱' },
      { id: 'upi', name: 'UPI Payment', type: 'mobile_money', provider: 'UPI', icon: '📱' },
      { id: 'phonepe', name: 'PhonePe', type: 'mobile_money', provider: 'PhonePe', icon: '📱' },
    ]
  },
  BR: {
    code: 'BR',
    name: 'Brazil',
    currency: 'BRL',
    flag: '🇧🇷',
    languages: ['pt'],
    phonePrefix: '+55',
    regions: ['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia', 'Paraná'],
    popularCities: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre'],
    paymentMethods: [
      { id: 'pix-br', name: 'PIX', type: 'mobile_money', provider: 'PIX', icon: '📱' },
      { id: 'card-br', name: 'Credit/Debit Card', type: 'card', icon: '💳' },
      { id: 'boleto', name: 'Boleto Bancário', type: 'bank_transfer', icon: '🏦' },
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

// Currency symbol mapping
export const CURRENCY_SYMBOLS: Record<string, string> = {
  'GHS': '₵',
  'NGN': '₦',
  'KES': 'KSh',
  'ZAR': 'R',
  'UGX': 'USh',
  'TZS': 'TSh',
  'USD': '$',
  'GBP': '£',
  'EUR': '€',
  'INR': '₹',
  'BRL': 'R$',
};

export const getCurrencySymbol = (currency: string): string => {
  return CURRENCY_SYMBOLS[currency] || currency;
};