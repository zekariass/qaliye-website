const CURRENCY_MINOR_UNITS: Record<string, number> = {
  ETB: 100,
  USD: 100,
  EUR: 100,
  GBP: 100,
};

export function formatMoney(
  minorUnits: number,
  currency: string,
  locale = "en-ET"
): string {
  const divisor = CURRENCY_MINOR_UNITS[currency.toUpperCase()] ?? 100;
  const amount = minorUnits / divisor;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function formatMinorUnits(minorUnits: number, currency: string): string {
  const divisor = CURRENCY_MINOR_UNITS[currency.toUpperCase()] ?? 100;
  return (minorUnits / divisor).toFixed(2);
}

export function parseToMinorUnits(value: string, currency: string): number {
  const divisor = CURRENCY_MINOR_UNITS[currency.toUpperCase()] ?? 100;
  const parsed = parseFloat(value.replace(/[^0-9.-]/g, ""));
  if (isNaN(parsed)) return 0;
  return Math.round(parsed * divisor);
}
