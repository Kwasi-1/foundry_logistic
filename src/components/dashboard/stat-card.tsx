import * as React from "react";
import { cn } from "@/lib/utils";
import { useMoneyMask } from "@/hooks/use-money-mask";
import { formatMoney } from "@/lib/money-utils";

interface StatCardProps {
  label: string;
  value: string | number;
  className?: string;
  masked?: boolean;
}

export function StatCard({ label, value, className, masked }: StatCardProps) {
  const { isMasked } = useMoneyMask();
  const shouldMask = masked !== undefined ? masked : isMasked;

  const formattedValue = React.useMemo(() => {
    if (typeof value === "string" && value.startsWith("GHS")) {
      const numericValue = parseFloat(value.replace(/[GHS,]/g, ""));
      if (!isNaN(numericValue)) {
        return formatMoney({ amount: numericValue, masked: shouldMask });
      }
    }
    return value;
  }, [value, shouldMask]);

  return (
    <div className={cn("rounded-lg bg-white p-6", className)}>
      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <p className="mt-4 text-4xl font-semibold text-gray-900">
        {formattedValue}
      </p>
    </div>
  );
}
