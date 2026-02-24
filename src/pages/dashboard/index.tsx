import React, { useState } from "react";
import { StorageGrid } from "@/components/dashboard/storage-grid";
import { SummaryPanel } from "@/components/dashboard/summary-panel";
import { AnalyticsCard } from "@/components/dashboard/analytics-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Bell,
  ChevronRight,
  Settings,
  SlidersHorizontal,
} from "lucide-react";
import { useAppSelector } from "@/store/store";

export default function Dashboard() {
  const { userInfo } = useAppSelector((s) => s.auth);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-primary-gray/50 -m-6 flex flex-col">
      {/* 
        HERO SECTION / TOP BACKGROUND
        We use a negative margin (-m-6) to make this bleed to the edges of the parent padding from the layout.
      */}
      <div
        className="relative h-[340px] w-full bg-slate-900 overflow-hidden flex-shrink-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8ed7c156f4?auto=format&fit=crop&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
        }}
      >
        {/* Gradients to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-gray-50/100" />

        {/* TOP HEADER OVER HERO image */}
        <header className="relative z-20 flex items-center justify-between px-8 py-6 w-full text-white">
          <div className="flex items-center gap-3">
            <span className="text-gray-300 font-medium tracking-wide text-sm">
              Logistics Platform
            </span>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <h1 className="text-xl font-bold tracking-tight text-white">
              Primary Warehouse View
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-white transition-colors" />
              <Input
                placeholder="Search freight, items, or IDs..."
                className="w-[300px] h-10 pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:bg-white/20 focus-visible:ring-white/30 rounded-full transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-gray-300 hover:text-white hover:bg-white/20"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-white/20">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 text-white hover:bg-white/20 rounded-full"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-slate-900" />
              </Button>
              <div className="flex items-center gap-3 ml-2 cursor-pointer p-1 pr-3 rounded-full hover:bg-white/10 transition-colors">
                <Avatar className="h-9 w-9 border border-white/20">
                  <AvatarImage
                    src={
                      (userInfo as any)?.avatar ||
                      "https://ui-avatars.com/api/?name=User&background=0284c7&color=fff"
                    }
                  />
                  <AvatarFallback className="bg-blue-600">U</AvatarFallback>
                </Avatar>
                <div className="hidden lg:flex flex-col items-start leading-none gap-1">
                  <span className="text-sm font-semibold">
                    {userInfo?.name || "Operations Manager"}
                  </span>
                  <span className="text-[10px] text-gray-300 uppercase tracking-wider font-semibold">
                    Warehouse Admin
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* HERO METRICS / OVERLAY */}
        <div className="relative z-10 px-8 mt-4">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-2">
            Zone A Command Center
          </h2>
          <p className="text-gray-300 max-w-2xl text-lg font-medium">
            Real-time telemetry and layout overview for the main distribution
            facility. Monitor incoming logistics and outbound shipments live.
          </p>
        </div>
      </div>

      {/* 
        MAIN CONTENT OVERLAPPING HERO 
      */}
      <div className="relative z-30 px-6 lg:px-8 -mt-24 pb-12 flex-grow flex flex-col gap-6 lg:gap-8">
        {/* Dashboard Info Cards (Top Row) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
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

        {/* Lower Content Split */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Primary Warehouse View (Replaces Truck visual) - 8 cols */}
          <div className="xl:col-span-8 w-full order-2 xl:order-1">
            <StorageGrid />
          </div>

          {/* Bottom Section - Warehouse Layout Analytics - 4 cols */}
          <div className="xl:col-span-4 w-full order-1 xl:order-2 sticky top-6">
            <SummaryPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
