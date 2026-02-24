import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { StorageDetailsPanel } from "./storage-details-panel";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomContainerComponent from "../shared/custom.container.component";

// ─── Types ───────────────────────────────────────────────────────────────────

type CellStatus = "ready" | "stocked" | "archived" | "active" | "low";
type SectionLayout = "2col" | "4col"; // narrow (2 units/row) or wide (4 units/row)

interface StorageUnit {
  id: string;
  status: CellStatus;
}

interface StorageSection {
  id: string;
  label: string;
  category: string;
  status: CellStatus;
  layout: SectionLayout;
  units: StorageUnit[];
  filled: number;
  total: number;
  highlighted?: boolean;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const UNIT_STATUSES: CellStatus[] = [
  "ready",
  "stocked",
  "archived",
  "active",
  "low",
];

function generateUnits(prefix: string, count: number): StorageUnit[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}${i + 1}`,
    status: UNIT_STATUSES[Math.floor(Math.random() * UNIT_STATUSES.length)],
  }));
}

function generateSections(): StorageSection[] {
  const templates: Array<{
    prefix: string;
    layout: SectionLayout;
    unitCount: number;
    category: string;
    status: CellStatus;
    highlighted?: boolean;
  }> = [
    {
      prefix: "A",
      layout: "2col",
      unitCount: 4,
      category: "Bestsellers Shelf",
      status: "ready",
    },
    {
      prefix: "B",
      layout: "4col",
      unitCount: 8,
      category: "Capsule Archive",
      status: "stocked",
    },
    {
      prefix: "C",
      layout: "2col",
      unitCount: 8,
      category: "Capsule Archive",
      status: "stocked",
    },
    {
      prefix: "D",
      layout: "4col",
      unitCount: 8,
      category: "Ready-to-Ship",
      status: "ready",
    },
    {
      prefix: "E",
      layout: "4col",
      unitCount: 8,
      category: "Ready-to-Ship",
      status: "ready",
    },
    {
      prefix: "F",
      layout: "2col",
      unitCount: 4,
      category: "Bestsellers Shelf",
      status: "ready",
    },
    {
      prefix: "G",
      layout: "2col",
      unitCount: 14,
      category: "Capsule Archive",
      status: "archived",
    },
    {
      prefix: "G-PRIME",
      layout: "4col",
      unitCount: 8,
      category: "Ready-to-Ship",
      status: "ready",
    },
    {
      prefix: "H",
      layout: "2col",
      unitCount: 4,
      category: "Bestsellers Shelf",
      status: "ready",
    },
    {
      prefix: "J",
      layout: "4col",
      unitCount: 8,
      category: "Ready-to-Ship",
      status: "ready",
      highlighted: true,
    },
    {
      prefix: "K",
      layout: "4col",
      unitCount: 8,
      category: "Wooden Furniture",
      status: "stocked",
    },
    {
      prefix: "L",
      layout: "4col",
      unitCount: 8,
      category: "Capsule Archive",
      status: "archived",
    },
    {
      prefix: "M",
      layout: "4col",
      unitCount: 8,
      category: "Ready-to-Ship",
      status: "ready",
    },
    {
      prefix: "N",
      layout: "2col",
      unitCount: 8,
      category: "Fully Stocked",
      status: "stocked",
    },
    {
      prefix: "P",
      layout: "2col",
      unitCount: 8,
      category: "Ready-to-Ship",
      status: "ready",
    },
    {
      prefix: "Q",
      layout: "4col",
      unitCount: 4,
      category: "Bestsellers Shelf",
      status: "ready",
    },
    {
      prefix: "R",
      layout: "4col",
      unitCount: 8,
      category: "Ready-to-Ship",
      status: "ready",
    },
    {
      prefix: "S",
      layout: "4col",
      unitCount: 4,
      category: "Bestsellers Shelf",
      status: "ready",
    },
    {
      prefix: "T",
      layout: "2col",
      unitCount: 14,
      category: "Capsule Archive",
      status: "archived",
    },
    {
      prefix: "U",
      layout: "4col",
      unitCount: 4,
      category: "Bestsellers Shelf",
      status: "ready",
    },
    {
      prefix: "V",
      layout: "4col",
      unitCount: 8,
      category: "Ready-to-Ship",
      status: "ready",
    },
    {
      prefix: "W",
      layout: "4col",
      unitCount: 7,
      category: "Ready-to-Ship",
      status: "ready",
    },
    {
      prefix: "X",
      layout: "4col",
      unitCount: 8,
      category: "Ready-to-Ship",
      status: "ready",
    },
    {
      prefix: "Y",
      layout: "4col",
      unitCount: 8,
      category: "Fully Stocked",
      status: "stocked",
    },
  ];

  return templates.map((t) => {
    const filled = Math.floor(Math.random() * t.unitCount);
    const prefix = t.prefix === "G-PRIME" ? "G" : t.prefix;
    return {
      id: t.prefix,
      label: t.prefix === "G-PRIME" ? "G" : t.prefix,
      category: t.category,
      status: t.status,
      layout: t.layout,
      units: generateUnits(prefix, t.unitCount),
      filled,
      total: t.unitCount * 35,
      highlighted: t.highlighted,
    };
  });
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StorageUnitCell({
  unit,
  highlighted,
  onClick,
}: {
  unit: StorageUnit;
  highlighted?: boolean;
  onClick: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onClick(unit.id)}
      className={cn(
        "rounded-xl flex items-center justify-center font-bold text-xs transition-all duration-150 active:scale-95 select-none",
        "h-9 w-full cursor-pointer",
        highlighted
          ? "bg-white text-gray-800 border border-white/80 shadow-sm hover:bg-gray-50"
          : "bg-white text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300",
      )}
    >
      {unit.id}
    </button>
  );
}

function StorageSectionCard({
  section,
  onUnitClick,
}: {
  section: StorageSection;
  onUnitClick: (unitId: string, section: StorageSection) => void;
}) {
  const statusLabel: Record<CellStatus, string> = {
    ready: "Ready-to-Ship",
    stocked: "Fully Stocked",
    archived: "Capsule Archive",
    active: "Active",
    low: "Low Stock",
  };

  const cols = section.layout === "4col" ? 4 : 2;

  return (
    <div
      className={cn(
        "relative rounded-2xl h-fit overflow-hidden flex flex-col gap-2 p-3",
        section.highlighted
          ? "bg-primary-green shadow-md shadow-orange-200/80"
          : "bg-primary-gray/30",
      )}
    >
      {/* Diagonal stripe overlay for highlighted */}
      {section.highlighted && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 6px, transparent 6px, transparent 18px)",
          }}
        />
      )}

      {/* Category label */}
      <p
        className={cn(
          "text-[10px] font-semibold uppercase tracking-wider truncate relative z-10",
          section.highlighted ? "text-white/80" : "text-gray-500",
        )}
      >
        {section.category}
      </p>

      <div
        className={cn(
          "relative z-10 grid gap-1.5 w-full",
          cols === 4 ? "grid-cols-4" : "grid-cols-2",
        )}
      >
        {section.units.map((unit) => (
          <StorageUnitCell
            key={unit.id}
            unit={unit}
            highlighted={section.highlighted}
            onClick={(id) => onUnitClick(id, section)}
          />
        ))}
      </div>

      {/* Footer */}
      <div
        className={cn(
          "relative z-10 flex justify-between items-center pt-1 mt-auto",
        )}
      >
        <span
          className={cn(
            "text-[9px] font-semibold uppercase tracking-wider",
            section.highlighted ? "text-white/90" : "text-gray-500",
          )}
        >
          {statusLabel[section.status]}
        </span>
        <span
          className={cn(
            "text-[9px] font-mono",
            section.highlighted ? "text-white/80" : "text-gray-400",
          )}
        >
          {section.highlighted
            ? `Available: ${section.filled}/${section.total}`
            : `${section.filled * 10} / ${section.total * 10}`}
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function StorageGrid() {
  const [sections, setSections] = useState<StorageSection[]>(() =>
    generateSections(),
  );
  const [selectedDetails, setSelectedDetails] = useState<{
    cellId: string;
    status: string;
    category: string;
    capacityStr: string;
    items: any[];
  } | null>(null);

  const handleRefresh = () => setSections(generateSections());

  const handleUnitClick = (unitId: string, section: StorageSection) => {
    setSelectedDetails({
      cellId: unitId,
      status: section.status,
      category: section.category,
      capacityStr: `${section.filled * 10} / ${section.total * 10} items`,
      items: [],
    });
  };

  return (
    <CustomContainerComponent styles="bg-white p-3 w-full min-h-full">
      <div className="w-full h-full flex flex-col">
        {/* ── Toolbar ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Warehouse Layout
            </h2>
            <p className="text-[10px] text-gray-500 font-medium mt-0.5">
              Zone A · {sections.length} sections
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className="h-7 w-7 text-gray-500 hover:text-gray-700 hover:bg-primary-gray/50"
            title="Refresh layout"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* ── Scrollable Masonry Layout ────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pr-1">
          <div className="columns-[260px] gap-3 pb-8">
            {sections.map((section) => (
              <div key={section.id} className="break-inside-avoid mb-3">
                <StorageSectionCard
                  section={section}
                  onUnitClick={handleUnitClick}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Detail Panel ─────────────────────────────────────────────────── */}
        {selectedDetails && (
          <StorageDetailsPanel
            isOpen={!!selectedDetails}
            onClose={() => setSelectedDetails(null)}
            cellId={selectedDetails.cellId}
            status={selectedDetails.status}
            category={selectedDetails.category}
            capacityStr={selectedDetails.capacityStr}
            items={selectedDetails.items}
          />
        )}
      </div>
    </CustomContainerComponent>
  );
}
