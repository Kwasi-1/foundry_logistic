import React from "react";
import { StorageGrid } from "@/components/dashboard/storage-grid";
import { AnalyticsCard } from "@/components/dashboard/analytics-card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import CustomContainerComponent from "@/components/shared/custom.container.component";
import PageLayout from "@/layout/PageLayout";

export default function WarehouseLayoutPage() {
  const navigate = useNavigate();

  return (
    <PageLayout
    title="Warehouse Layout"
      actions={
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-white border shadow-sm hover:bg-gray-100 h-9 w-9"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 text-gray-700" />
        </Button>
      }
      className="-m6 w-full"
    >
      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      {/* <div className="flex items-center gap-3 mb-6 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-white border shadow-sm hover:bg-gray-100 h-9 w-9"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 text-gray-700" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Warehouse Layout Overview
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-0.5">
            Detailed view of Zone A · Distribution Hub
          </p>
        </div>
      </div> */}

      {/* ── HORIZONTAL ANALYTICS CARDS ───────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3 flex-shrink-0">
        <AnalyticsCard
          title="Total Product Stock"
          value="142,850"
          trend="up"
          trendValue="12.4"
          timeContext="vs Last Month"
          hideAction
          className="bg-primary-gray/30"
        />
        <AnalyticsCard
          title="Total Check-ins"
          value="12,045"
          trend="up"
          trendValue="29.0"
          timeContext="This Week"
          hideAction
          className="bg-primary-gray/30"
        />
        <AnalyticsCard
          title="Total Check-outs"
          value="8,432"
          trend="down"
          trendValue="4.2"
          timeContext="This Week"
          hideAction
          className="bg-primary-gray/30"
        />
        <AnalyticsCard
          title="Low Stock Warning"
          value="22"
          trend="up"
          trendValue="15.0"
          timeContext="Active Items"
          hideAction
          className="bg-primary-gray/30"
        />
      </div>

      {/* ── WAREHOUSE STORAGE GRID ───────────────────────────────────────── */}
      <div className="flex-1 min-h-0 h-full relative">
        <StorageGrid showToolbar={false} className="bg-primary-gray/30" />
      </div>
    </PageLayout>
  );
}
