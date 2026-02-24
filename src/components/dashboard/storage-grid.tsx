import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { StorageCell } from "./storage-cell";
import { StorageDetailsPanel } from "./storage-details-panel";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomContainerComponent from "../shared/custom.container.component";

// Mock Data Generator
const MOCK_CATEGORIES = [
  "Electronics",
  "Furniture",
  "Apparel",
  "Automotive",
  "Groceries",
];
const STATUS_OPTIONS = [
  "full",
  "partial",
  "empty",
  "reserved",
  "low-stock",
] as const;

const generateMockGrid = (rows: number, cols: number) => {
  const grid = [];
  for (let r = 0; r < rows; r++) {
    const rowId = String.fromCharCode(65 + r); // A, B, C...
    for (let c = 1; c <= cols; c++) {
      const id = `${rowId}${c}`;

      // Seed random behavior
      const rand = Math.random();
      let status: (typeof STATUS_OPTIONS)[number] = "empty";
      let utilization = 0;

      if (rand > 0.85) {
        status = "full";
        utilization = Math.floor(Math.random() * 10 + 90);
      } else if (rand > 0.5) {
        status = "partial";
        utilization = Math.floor(Math.random() * 60 + 20);
      } else if (rand > 0.4) {
        status = "reserved";
        utilization = 100;
      } else if (rand > 0.3) {
        status = "low-stock";
        utilization = Math.floor(Math.random() * 15 + 1);
      }

      const category =
        MOCK_CATEGORIES[Math.floor(Math.random() * MOCK_CATEGORIES.length)];

      const numItems =
        status === "empty" ? 0 : Math.floor(Math.random() * 5) + 1;
      const mockItems = Array.from({ length: numItems }).map((_, i) => ({
        id: `ITM-${id}-${i}`,
        name: `${category} Item ${i + 1}`,
        sku: `SKU-${Math.floor(Math.random() * 100000)}`,
        quantity: Math.floor(Math.random() * 500),
        status:
          status === "low-stock"
            ? "Low Stock"
            : ((status === "reserved" ? "Reserved" : "In Stock") as
                | "In Stock"
                | "Low Stock"
                | "Reserved"),
        lastUpdated: `${Math.floor(Math.random() * 24)}h ago`,
      }));

      grid.push({ id, status, category, utilization, mockItems });
    }
  }
  return grid;
};

export function StorageGrid() {
  const [selectedCell, setSelectedCell] = useState<{
    id: string;
    details: any;
  } | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [gridData, setGridData] = useState(() => generateMockGrid(6, 12));

  // Handle cell click
  const handleCellClick = (id: string, details: any) => {
    setSelectedCell({ id, details });
  };

  const handleRefresh = () => {
    setGridData(generateMockGrid(6, 12));
  };

  const filteredGrid = useMemo(() => {
    if (filter === "all") return gridData;
    return gridData.map((cell) => ({
      ...cell,
      // Gray out non-matching cells slightly, but keep real data accessible
      opacity: cell.status === filter ? "opacity-100" : "opacity-20 ",
    }));
  }, [filter, gridData]);

  // Derived stats
  const stats = useMemo(() => {
    const total = gridData.length;
    let full = 0,
      partial = 0,
      empty = 0,
      reserved = 0,
      low = 0;

    gridData.forEach((c) => {
      if (c.status === "full") full++;
      else if (c.status === "partial") partial++;
      else if (c.status === "empty") empty++;
      else if (c.status === "reserved") reserved++;
      else if (c.status === "low-stock") low++;
    });

    return {
      total,
      full,
      partial,
      empty,
      reserved,
      low,
      utilPct: Math.round(((total - empty) / total) * 100),
    };
  }, [gridData]);

  return (
    <CustomContainerComponent styles="bg-white p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div
        className="absolute inset-x-0 bottom-0 h-96 bg-[url('/images/bg-grid.png')] opacity-5 pointer-events-none -z-0"
        style={{
          maskImage: "linear-gradient(to top, black 20%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to top, black 20%, transparent 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 mb-1">
            Warehouse Layout
          </h2>
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-500 font-medium">
              Zone A Optimization
            </p>
            <Badge variant="secondary" className="px-2 py-0 h-5 font-mono">
              {stats.utilPct}% Utilized
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto self-end">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            className="h-9 w-9"
            title="Simulate updates"
          >
            <RefreshCcw className="h-4 w-4 text-gray-500" />
          </Button>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[160px] h-9 text-sm font-medium">
              <SelectValue placeholder="Filter view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="full">Full Capacity</SelectItem>
              <SelectItem value="partial">Partially Filled</SelectItem>
              <SelectItem value="empty">Empty Slots</SelectItem>
              <SelectItem value="reserved">Reserved/Locked</SelectItem>
              <SelectItem value="low-stock">Low Stock Alerts</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Legend */}
      <div className="relative z-10 flex flex-wrap gap-x-6 gap-y-2 mb-8 items-center text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-red-500 border border-red-600 shadow-sm" />
          <span className="font-medium text-gray-600">
            Full <span className="text-gray-400 ml-1">({stats.full})</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-amber-400 border border-amber-500 shadow-sm" />
          <span className="font-medium text-gray-600">
            Partial{" "}
            <span className="text-gray-400 ml-1">({stats.partial})</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-white border border-gray-300" />
          <span className="font-medium text-gray-600">
            Empty <span className="text-gray-400 ml-1">({stats.empty})</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-blue-500 border border-blue-600 shadow-sm" />
          <span className="font-medium text-gray-600">
            Reserved{" "}
            <span className="text-gray-400 ml-1">({stats.reserved})</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-orange-500 border border-orange-600 shadow-sm" />
          <span className="font-medium text-gray-600">
            Low Stock <span className="text-gray-400 ml-1">({stats.low})</span>
          </span>
        </div>
      </div>

      {/* The Grid */}
      <div className="relative z-10 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-3 sm:gap-4 p-4 sm:p-6 bg-gray-50/50 rounded-xl border border-gray-200">
        {filteredGrid.map((cell) => (
          <div
            key={cell.id}
            className={cn(
              "transition-opacity duration-300",
              "opacity" in cell ? cell.opacity : "",
            )}
          >
            <StorageCell
              id={cell.id}
              status={cell.status}
              category={cell.category}
              utilization={cell.utilization}
              mockItems={cell.mockItems}
              onClick={handleCellClick}
            />
          </div>
        ))}
      </div>

      {/* Detail Modal/Sheet */}
      {selectedCell && (
        <StorageDetailsPanel
          isOpen={!!selectedCell}
          onClose={() => setSelectedCell(null)}
          cellId={selectedCell.id}
          status={selectedCell.details.status}
          category={selectedCell.details.category}
          capacityStr={selectedCell.details.capacityStr}
          items={selectedCell.details.items}
        />
      )}
    </CustomContainerComponent>
  );
}
