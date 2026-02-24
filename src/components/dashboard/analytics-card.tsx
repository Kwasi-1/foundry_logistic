import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export interface AnalyticsCardProps {
  title: string;
  value: string;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  timeContext: string;
  chartData?: { value: number }[]; // kept for API compatibility, unused
  className?: string;
  colorTheme?: "blue" | "green" | "red" | "orange" | "purple";
}

export function AnalyticsCard({
  title,
  value,
  trend,
  trendValue,
  timeContext,
  className,
}: AnalyticsCardProps) {
  const trendTextClass =
    trend === "up"
      ? "text-emerald-600"
      : trend === "down"
        ? "text-red-500"
        : "text-gray-400";

  const trendSign = trend === "up" ? "+" : trend === "down" ? "-" : "";

  return (
    <div
      className={cn(
        "bg-white p-5 border-0 rounded-none w-full min-h-0 flex flex-col",
        className,
      )}
    >
      {/* ── Row 1: Expand button (top-right only) ─────────────────────── */}
      

      {/* ── Row 2: Title & Value ─────────────────────────────────────── */}
      <div className="flex justify-between mb-6">
      <div className="flex flex-col gap-1.5 mb-2">
        <p className="text-xs font-semibold text-[#8B98A6] uppercase tracking-wider leading-none">
          {title}
        </p>
        <p className="text-3xl font-bold text-[#111827] tracking-tight leading-none mb-1">
          {value}
        </p>
      </div>
      <div className="flex justify-end mb-4">
        <button
          className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors shadow-sm"
          title="View details"
        >
          <ArrowUpRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      </div>

      {/* ── Row 3: Trend % + Context label ───────────────────────────── */}
      <div className="flex items-center gap-1.5 mt-auto">
        {trendValue && (
          <span className={cn("text-sm font-bold", trendTextClass)}>
            {trendSign}
            {trendValue}%
          </span>
        )}
        <span className="text-sm font-medium text-[#8B98A6]">
          {timeContext}
        </span>
      </div>
    </div>
  );
}
