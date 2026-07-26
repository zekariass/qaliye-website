import { formatMoney } from "@/lib/admin/money";

interface MoneyProps {
  minorUnits: number;
  currency: string;
  locale?: string;
  className?: string;
}

export function Money({ minorUnits, currency, locale, className }: MoneyProps) {
  return (
    <span className={`font-mono tabular-nums ${className ?? ""}`}>
      {formatMoney(minorUnits, currency, locale)}
    </span>
  );
}
