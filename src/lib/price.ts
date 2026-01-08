
export function formatPriceUSD(amountINR: number, usdRate: number) {
  const usd = amountINR * usdRate;
  return `$${usd.toFixed(2)}`;
}
