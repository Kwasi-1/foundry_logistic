import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

interface StorageItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  status: "In Stock" | "Low Stock" | "Reserved";
  lastUpdated: string;
}

interface StorageDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  cellId: string | null;
  status: string;
  category: string;
  capacityStr: string;
  items: StorageItem[];
}

export function StorageDetailsPanel({
  isOpen,
  onClose,
  cellId,
  status,
  category,
  capacityStr,
  items,
}: StorageDetailsPanelProps) {
  const statusColor = useMemo(() => {
    switch (status) {
      case "full":
        return "bg-red-500 hover:bg-red-600 text-white border-transparent";
      case "partial":
        return "bg-amber-500 hover:bg-amber-600 text-white border-transparent";
      case "empty":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200";
      case "reserved":
        return "bg-blue-500 hover:bg-blue-600 text-white border-transparent";
      case "low-stock":
        return "bg-orange-500 hover:bg-orange-600 text-white border-transparent";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }, [status]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-[400px] sm:w-[500px] overflow-y-auto"
      >
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-semibold">
              Storage Unit {cellId}
            </SheetTitle>
            <Badge
              variant="outline"
              className={cn("px-3 py-1 capitalize border", statusColor)}
            >
              {status.replace("-", " ")}
            </Badge>
          </div>
        </SheetHeader>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">
              Capacity
            </p>
            <p className="font-semibold text-gray-900">{capacityStr}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">
              Category
            </p>
            <p className="font-semibold text-gray-900">{category}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">
              Zone
            </p>
            <p className="font-semibold text-gray-900">Ambient Temp</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">
              Last Checked
            </p>
            <p className="font-semibold text-gray-900">Today, 08:30 AM</p>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">
            Inventory Items
          </h3>
          {items.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
              <p className="text-gray-500">No items presently stored.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">
                        SKU: {item.sku}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        item.status === "In Stock" &&
                          "bg-green-50 text-green-700 border-green-200",
                        item.status === "Low Stock" &&
                          "bg-orange-50 text-orange-700 border-orange-200",
                        item.status === "Reserved" &&
                          "bg-blue-50 text-blue-700 border-blue-200",
                      )}
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <div>
                      <p className="text-xs text-gray-500">Quantity</p>
                      <p className="font-semibold text-gray-900">
                        {item.quantity} units
                      </p>
                    </div>
                    <p className="text-xs text-gray-400">
                      Updated: {item.lastUpdated}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
