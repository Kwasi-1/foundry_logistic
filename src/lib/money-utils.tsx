import * as React from "react";

import { cn } from "@/lib/utils";

interface FormatMoneyOptions {
  amount: number;
  currency?: string;
  locale?: string;
  masked?: boolean;
  showCurrency?: boolean;
  fontClassName?: string;
}

/**
 * Formats money with superscript decimals
 * Example: $45.23 becomes $45²³
 */
export function formatMoney({
  amount,
  currency = "GHS",
  locale = "en-US",
  masked = false,
  showCurrency = true,
  fontClassName = "font-semibold",
}: FormatMoneyOptions): React.ReactNode {
  if (masked) {
    return <span className={fontClassName}>*.**</span>;
  }

  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  // Split into currency symbol, integer part, and decimal part
  const parts = formatted.match(/^([^\d]+)?(\d{1,3}(?:,\d{3})*)(\.(\d+))?$/);

  if (!parts) {
    return formatted;
  }

  const currencySymbol = parts[1] || "";
  const integerPart = parts[2];
  const decimalPart = parts[4] || "00";

  return (
    <span className={cn(fontClassName)}>
      {showCurrency && currencySymbol}
      {integerPart}.
      <sup className={cn("text-[0.6em]", fontClassName)}>{decimalPart}</sup>
    </span>
  );
}

/**
 * Component wrapper for formatting money
 */
interface MoneyProps {
  amount: number;
  currency?: string;
  locale?: string;
  masked?: boolean;
  showCurrency?: boolean;
  className?: string;
  fontClassName?: string;
}

export function Money({
  amount,
  currency = "USD",
  locale = "en-US",
  masked = false,
  showCurrency = true,
  className,
  fontClassName,
}: MoneyProps) {
  return (
    <span className={className}>
      {formatMoney({
        amount,
        currency,
        locale,
        masked,
        showCurrency,
        fontClassName,
      })}
    </span>
  );
}
