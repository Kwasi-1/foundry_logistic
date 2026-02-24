import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";

export interface StorageCellProps {
  id: string;
  status: "full" | "partial" | "empty" | "reserved" | "low-stock";
  category: string;
  utilization: number; // 0-100
  onClick: (id: string, details: any) => void;
  mockItems?: any[];
}

export function StorageCell({
  id,
  status,
  category,
  utilization,
  onClick,
  mockItems = [],
}: StorageCellProps) {
  const statusColor = useMemo(() => {
    switch (status) {
      case "full":
        return "bg-red-500 hover:bg-red-600 border-red-600 shadow-sm text-white";
      case "partial":
        return "bg-amber-400 hover:bg-amber-500 border-amber-500 shadow-sm text-amber-950";
      case "empty":
        return "bg-white hover:bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300";
      case "reserved":
        return "bg-blue-500 hover:bg-blue-600 border-blue-600 shadow-sm text-white";
      case "low-stock":
        return "bg-orange-500 hover:bg-orange-600 border-orange-600 shadow-sm text-white";
      default:
        return "bg-white hover:bg-gray-50 border-gray-200 text-gray-500";
    }
  }, [status]);

  const capacityStr = useMemo(() => {
    return `${utilization}% utilized`;
  }, [utilization]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          onClick={() =>
            onClick(id, { status, category, capacityStr, items: mockItems })
          }
          className={cn(
            "w-full h-16 sm:h-20 lg:h-24 rounded-lg border flex flex-col items-center justify-center p-2 transition-all duration-200",
            "active:scale-95 cursor-pointer relative group",
            statusColor,
          )}
        >
          <span className="font-semibold text-sm sm:text-base lg:text-lg tracking-tight z-10">
            {id}
          </span>

          {/* subtle pattern overlay for textured look on filled slots */}
          {status !== "empty" && (
            <div className="absolute inset-0 opacity-10 bg-[url('/images/bg-grid.png')] bg-cover mix-blend-overlay pointer-events-none rounded-lg z-0" />
          )}

          {/* subtle glow on hover */}
          <div className="absolute inset-0 ring-2 ring-primary ring-offset-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none z-20" />
        </button>
      </PopoverTrigger>

      {/* Quick peek popover - desktop only */}
      <PopoverContent className="hidden lg:block w-64 p-4 z-[60]" side="top">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-bold text-gray-900 border-b w-full pb-1">
            {id} Quick View
          </h4>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <Badge
              variant="outline"
              className={cn(
                "px-2 py-0 h-5 text-[10px] uppercase font-bold tracking-wider rounded-sm",
                statusColor.split(" ")[0],
              )}
            >
              {status.replace("-", " ")}
            </Badge>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Utilization</span>
              <span className="font-medium">{utilization}%</span>
            </div>
            <Progress value={utilization} className="h-1.5" />
          </div>
          <p className="text-xs text-center text-primary-cct mt-3 font-medium bg-primary-gray/10 py-1 rounded-sm cursor-pointer hover:bg-primary-gray/20 transition-colors">
            Click cell for full details
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
