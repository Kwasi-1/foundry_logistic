import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import CustomModal from "@/components/modals/modal";
import CustomContainerComponent from "@/components/shared/custom.container.component";
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
      case "ready":
        return "bg-primary-green/10 text-primary-green border-primary-green/20";
      case "partial":
      case "active":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "empty":
        return "bg-gray-100 text-gray-600 border-gray-200";
      case "reserved":
      case "archived":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "low-stock":
      case "low":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "stocked":
        return "bg-primary-green/10 text-primary-green border-primary-green/20";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  }, [status]);

  const statusLabel = useMemo(() => {
    const map: Record<string, string> = {
      ready: "Ready to Ship",
      stocked: "Fully Stocked",
      archived: "Archived",
      active: "Active",
      low: "Low Stock",
      full: "Full",
      partial: "Partial",
      empty: "Empty",
      reserved: "Reserved",
      "low-stock": "Low Stock",
    };
    return map[status] ?? status;
  }, [status]);

  // ── Modal Header ──────────────────────────────────────────────────────────
  const header = (
    <div className="flex items-center justify-between w-full pr-2">
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
          Storage Unit
        </p>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
          {cellId}
        </h2>
      </div>
      <Badge
        variant="outline"
        className={cn(
          "px-3 py-1 capitalize font-semibold text-xs border rounded-full",
          statusColor,
        )}
      >
        {statusLabel}
      </Badge>
    </div>
  );

  // ── Modal Body ────────────────────────────────────────────────────────────
  const body = (
    <div className="flex flex-col gap-4 pb-6 pt-2">
      {/* Info cards — each wrapped in CustomContainerComponent */}
      <div className="grid grid-cols-2 gap-3">
        <CustomContainerComponent styles="min-h-0 p-3 gap-0.5 bg-primary-gray/30">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
            Capacity
          </p>
          <p className="font-semibold text-sm text-gray-800">{capacityStr}</p>
        </CustomContainerComponent>

        <CustomContainerComponent styles="min-h-0 p-3 gap-0.5 bg-primary-gray/30">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
            Category
          </p>
          <p className="font-semibold text-sm text-gray-800 truncate">
            {category}
          </p>
        </CustomContainerComponent>

        <CustomContainerComponent styles="min-h-0 p-3 gap-0.5 bg-primary-gray/30 ">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
            Zone
          </p>
          <p className="font-semibold text-sm text-gray-800">Ambient</p>
        </CustomContainerComponent>

        <CustomContainerComponent styles="min-h-0 p-3 gap-0.5 bg-primary-gray/30">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
            Last Checked
          </p>
          <p className="font-semibold text-sm text-gray-800">Today, 08:30 AM</p>
        </CustomContainerComponent>
      </div>

      {/* Inventory Items */}
      <CustomContainerComponent
        title="Inventory Items"
        styles="min-h-0 bg-primary-gray/20"
      >
        {items.length === 0 ? (
          <div className="text-center py-10 border border-dashed  bg-white/60">
            <p className="text-sm text-gray-400">No items currently stored.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <CustomContainerComponent
                key={item.id}
                styles="min-h-0 p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                      SKU: {item.sku}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-semibold rounded-full",
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
                <div className="flex justify-between items-end mt-3">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                      Quantity
                    </p>
                    <p className="font-semibold text-sm text-gray-800">
                      {item.quantity} units
                    </p>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Updated: {item.lastUpdated}
                  </p>
                </div>
              </CustomContainerComponent>
            ))}
          </div>
        )}
      </CustomContainerComponent>
    </div>
  );

  return (
    <CustomModal
      isOpen={isOpen}
      onOpenChange={onClose}
      onClose={onClose}
      header={header}
      body={body}
      placement="right"
      size="md"
      scrollBehavior="inside"
      isDismissable
      classNames={{
        base: "bg-white",
        header: "border-b border-gray-100 pb-3",
        body: "px-4",
      }}
    />
  );
}
