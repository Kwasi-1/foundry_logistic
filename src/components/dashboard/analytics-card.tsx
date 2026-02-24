import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import CustomContainerComponent from "../shared/custom.container.component";

const MOCK_CHART_DATA = [
  { value: 400 },
  { value: 300 },
  { value: 550 },
  { value: 450 },
  { value: 700 },
  { value: 650 },
  { value: 800 },
];

export interface AnalyticsCardProps {
  title: string;
  value: string;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  timeContext: string;
  chartData?: { value: number }[];
  className?: string;
  colorTheme?: "blue" | "green" | "red" | "orange" | "purple";
}

const themeColors = {
  blue: {
    stroke: "#3b82f6",
    fill: "url(#colorBlue)",
    badge: "bg-blue-50 text-blue-700",
    text: "text-blue-500",
  },
  green: {
    stroke: "#10b981",
    fill: "url(#colorGreen)",
    badge: "bg-green-50 text-green-700",
    text: "text-green-500",
  },
  red: {
    stroke: "#ef4444",
    fill: "url(#colorRed)",
    badge: "bg-red-50 text-red-700",
    text: "text-red-500",
  },
  orange: {
    stroke: "#f97316",
    fill: "url(#colorOrange)",
    badge: "bg-orange-50 text-orange-700",
    text: "text-orange-500",
  },
  purple: {
    stroke: "#8b5cf6",
    fill: "url(#colorPurple)",
    badge: "bg-purple-50 text-purple-700",
    text: "text-purple-500",
  },
};

export function AnalyticsCard({
  title,
  value,
  trend,
  trendValue,
  timeContext,
  chartData = MOCK_CHART_DATA,
  className,
  colorTheme = "blue",
}: AnalyticsCardProps) {
  const colors = themeColors[colorTheme];

  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  // Custom badges for trend rather than color theme, but keeping color info for charts
  const trendClass =
    trend === "up"
      ? "text-green-600 bg-green-50 border-green-200"
      : trend === "down"
        ? "text-red-600 bg-red-50 border-red-200"
        : "text-gray-600 bg-gray-50 border-gray-200";

  return (
    <CustomContainerComponent
      title={title}
      styles={cn(
        "bg-white p-6 border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow",
        className,
      )}
    >
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex flex-col items-end gap-1 px-2 py-1 rounded-md border text-xs font-semibold",
            trendClass,
          )}
        >
          <div className="flex items-center gap-1">
            {trend === "up" ? "+" : trend === "down" ? "-" : ""}
            {trendValue}%
            <TrendIcon className="w-3 h-3" />
          </div>
          <span className="text-[9px] font-medium text-muted-foreground uppercase opacity-80">
            {timeContext}
          </span>
        </div>
      </div>

      <div className="h-[60px] w-full mt-4 -mx-2 -mb-2 relative z-0 opacity-60 group-hover:opacity-100 transition-opacity hidden">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient
                id={`color${colorTheme}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={colors.stroke} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors.stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={colors.stroke}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#color${colorTheme})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CustomContainerComponent>
  );
}
