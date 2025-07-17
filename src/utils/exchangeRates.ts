
// Simple static exchange rates for demonstration. In production, fetch from an API.
export const exchangeRates: Record<string, number> = {
  GHS: 1, // Base
  USD: 0.085, // 1 GHS = 0.085 USD
  NGN: 146.65, // 1 GHS = 146.65 NGN
  ZAR: 1.6, // 1 GHS = 1.6 ZAR
  EUR: 0.078, // 1 GHS = 0.078 EUR
  GBP: 0.066, // 1 GHS = 0.066 GBP
  PKR: 24, // 1 GHS = 24 PKR
  KES: 11.5, // 1 GHS = 11.5 KES
  UGX: 320, // 1 GHS = 320 UGX
  TZS: 200, // 1 GHS = 200 TZS
  INR: 7.2, // 1 GHS = 7.2 INR
  BRL: 0.52, // 1 GHS = 0.52 BRL
};

export function convertFromGHS(amount: number, targetCurrency: string): number {
  const rate = exchangeRates[targetCurrency] || 1;
  console.log(`Converting ${amount} GHS to ${targetCurrency} at rate ${rate}`);
  return amount * rate;
}

export function convertFromNGN(amount: number, targetCurrency: string): number {
  const ngnToGhs = amount / exchangeRates["NGN"]; // Convert NGN to GHS
  const rate = exchangeRates[targetCurrency] || 1;
  const result = ngnToGhs * rate;

  console.log(
    `Converting ${amount} NGN to ${targetCurrency}: (${amount} / ${exchangeRates["NGN"]}) * ${rate} = ${result}`
  );

  return result;
}

export function convertFromUSD(amount: number, targetCurrency: string): number {
  const usdToGhs = amount / exchangeRates["USD"]; // Convert USD to GHS
  const rate = exchangeRates[targetCurrency] || 1;
  const result = usdToGhs * rate;

  console.log(
    `Converting ${amount} USD to ${targetCurrency}: (${amount} / ${exchangeRates["USD"]}) * ${rate} = ${result}`
  );

  return result;
}

export function convertFromGBP(amount: number, targetCurrency: string): number {
  const gbpToGhs = amount / exchangeRates["GBP"]; // Convert GBP to GHS
  const rate = exchangeRates[targetCurrency] || 1;
  const result = gbpToGhs * rate;

  console.log(
    `Converting ${amount} GBP to ${targetCurrency}: (${amount} / ${exchangeRates["GBP"]}) * ${rate} = ${result}`
  );

  return result;
}

export function convertFromPKR(amount: number, targetCurrency: string): number {
  const pkrToGhs = amount / exchangeRates["PKR"]; // Convert PKR to GHS
  const rate = exchangeRates[targetCurrency] || 1;
  const result = pkrToGhs * rate;

  console.log(
    `Converting ${amount} PKR to ${targetCurrency}: (${amount} / ${exchangeRates["PKR"]}) * ${rate} = ${result}`
  );

  return result;
}

// Generic conversion function
export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  // Convert to GHS first (our base currency)
  let amountInGHS = amount;
  if (fromCurrency !== 'GHS') {
    amountInGHS = amount / exchangeRates[fromCurrency];
  }

  // Convert from GHS to target currency
  const result = amountInGHS * exchangeRates[toCurrency];
  
  console.log(
    `Converting ${amount} ${fromCurrency} to ${toCurrency}: ${amount} -> ${amountInGHS} GHS -> ${result} ${toCurrency}`
  );

  return result;
}
