import React, { useState } from "react";
import { StorageGrid } from "@/components/dashboard/storage-grid";
import { SummaryPanel } from "@/components/dashboard/summary-panel";
import { AnalyticsCard } from "@/components/dashboard/analytics-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import CustomContainerComponent from "@/components/shared/custom.container.component";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-primary-gray -m-6 flex flex-col">
      {/* ── TOP: SEARCH BAR ONLY ─────────────────────────────────────── */}
      <div className="w-full flex items-center justify-center px-6 py-3 bg-primary-gray border-b border-gray-200/60">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search freight, items, or IDs..."
            className="w-full pl-10 h-9 bg-white border-gray-200 text-gray-700 placeholder:text-gray-400 rounded-full shadow-sm focus-visible:ring-primary-green/40"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ── HERO + RIGHT STATS PANEL ─────────────────────────────────── */}
      <div className="flex flex-col xl:flex-row flex-grow">
        {/* ── HERO ── */}
        <div className="flex-1 relative flex flex-col items-center justify-center bg-primary-gray overflow-hidden min-h-[380px] xl:min-h-[480px]">
          {/* Subtle label */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none select-none">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
              Zone A · Distribution Hub
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-semibold text-gray-700">
                Available Storage Space
              </span>
              <span className="bg-primary-green text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                Live
              </span>
            </div>
          </div>

          <img
            src="/images/landling_hero.png"
            alt="Warehouse Facility"
            className="w-full h-full object-contain select-none"
            draggable={false}
          />
        </div>

        {/* ── RIGHT: STACKED STAT CARDS ── */}
        <div className="w-full xl:w-[300px] flex-shrink-0 border-l border-gray-200/60">
          <CustomContainerComponent
            title="Warehouse Metrics"
            styles="min-h-full h-full"
          >
            <div className="flex flex-col gap-3">
              <AnalyticsCard
                title="Total Product Stock"
                value="142,850"
                trend="up"
                trendValue="12.4"
                timeContext="vs Last Month"
                colorTheme="blue"
                chartData={[
                  { value: 120000 },
                  { value: 125000 },
                  { value: 130000 },
                  { value: 128000 },
                  { value: 135000 },
                  { value: 140000 },
                  { value: 142850 },
                ]}
              />
              <AnalyticsCard
                title="Total Check-ins"
                value="12,045"
                trend="up"
                trendValue="29.0"
                timeContext="This Week"
                colorTheme="orange"
                chartData={[
                  { value: 8000 },
                  { value: 8500 },
                  { value: 7000 },
                  { value: 9500 },
                  { value: 10500 },
                  { value: 11000 },
                  { value: 12045 },
                ]}
              />
              <AnalyticsCard
                title="Total Check-outs"
                value="8,432"
                trend="down"
                trendValue="4.2"
                timeContext="This Week"
                colorTheme="green"
                chartData={[
                  { value: 9000 },
                  { value: 9500 },
                  { value: 8800 },
                  { value: 9200 },
                  { value: 8700 },
                  { value: 8500 },
                  { value: 8432 },
                ]}
              />
              <AnalyticsCard
                title="Low Stock Warning"
                value="22"
                trend="up"
                trendValue="15.0"
                timeContext="Active Items"
                colorTheme="red"
                chartData={[
                  { value: 10 },
                  { value: 12 },
                  { value: 14 },
                  { value: 18 },
                  { value: 20 },
                  { value: 21 },
                  { value: 22 },
                ]}
              />
            </div>
          </CustomContainerComponent>
        </div>
      </div>

      {/* ── BOTTOM: WAREHOUSE LAYOUT + FACILITY OVERVIEW ─────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 border-t border-gray-200/60">
        {/* Warehouse Layout */}
        <div className="xl:col-span-8 border-r border-gray-200/60">
          <CustomContainerComponent title="Warehouse Layout">
            <StorageGrid />
          </CustomContainerComponent>
        </div>

        {/* Facility Overview */}
        <div className="xl:col-span-4">
          <CustomContainerComponent title="Facility Overview">
            <SummaryPanel />
          </CustomContainerComponent>
        </div>
      </div>
    </div>
  );
}
