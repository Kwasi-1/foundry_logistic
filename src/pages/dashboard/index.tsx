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
    /**
     * Root: fills the layout area (parent already has padding, we bleed out with -m-6).
     * `relative` + `overflow-hidden` locks the viewport so only inner panels scroll.
     */
    <div
      className="relative bg-transparent custom-font"
      style={{ height: "calc(100vh - 0px)" }}
    >
      {/* ── BACKGROUND: HERO IMAGE ─────────────────────────────────────────
          Fills the entire viewport. Pointer-events none so overlays are
          fully interactive.
      ──────────────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 flex items-center justify-center bgprimary-gray overflow-hidden">
        {/* Faint label at top-center */}
        {/* <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none select-none">
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
        </div> */}

        <img
          src="/images/landling_hero.png"
          alt="Warehouse Facility"
          className="w-[68%] h-full ml-[8%] -mt-40 mr-auto object-contain select-none"
          draggable={false}
        />
      </div>

      {/* ── TOP: FLOATING SEARCH BAR ───────────────────────────────────────
          Fixed to top, centered, above everything.
      ──────────────────────────────────────────────────────────────────── */}
      <div className="hidden absolute top-0 left-0 right-0 z-30 flex items-center justify-center px-6 py-3">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search freight, items, or IDs..."
            className="w-full pl-10 h-9 bg-white/90 backdrop-blur-sm border-gray-200 text-gray-700 placeholder:text-gray-400 rounded-full shadow-sm focus-visible:ring-primary-green/40"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ── TOP-LEFT: WELCOME HEADER ───────────────────────────────────────
          Displays a welcome greeting over the hero background.
      ──────────────────────────────────────────────────────────────────── */}
      <div className="absolute top-8 left-8 z-30 pointer-events-auto">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Welcome back, <span className="text-primary-green">Gibson</span> 👋
        </h1>
        <p className="text-sm text-gray-500 font-medium mt-1">
          Here's what's happening at Foundry Logistics today.
        </p>
      </div>

      {/* ── FOREGROUND OVERLAY LAYER ────────────────────────────────────────
          This layer sits above the hero image and holds both panels.
          It is NOT scrollable itself — only the inner panels scroll.
      ──────────────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-20 pointer-events-none flex items-end">
        {/* ── LEFT: WAREHOUSE LAYOUT PANEL ──────────────────────────────────
            Anchored to bottom-left. ~40vh tall initially.
            Scrollable upward (overflow-y-auto) to reveal full content.
            pointer-events-auto re-enables interaction inside this panel.
        ──────────────────────────────────────────────────────────────────── */}
        <div
          className="pointer-events-auto flex-1 overflow-y-auto scrollbar-hide ml-4"
          style={{ maxHeight: "42vh" }}
        >
          <StorageGrid />
        </div>

        {/* ── RIGHT: STACKED STAT CARDS PANEL ───────────────────────────────
            Anchored to bottom-right. Full height, scrollable.
            pointer-events-auto re-enables interaction.
        ──────────────────────────────────────────────────────────────────── */}
        <div
          className="pointer-events-auto w-full xl:w-[400px] flex-shrink overflow-y-auto scrollbar-hide"
          style={{ maxHeight: "calc(100vh - 48px)", marginTop: "48px" }}
        >
          <CustomContainerComponent
            title="Warehouse Metrics"
            styles="min-h-full h-full bg-transparent"
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
    </div>
  );
}
