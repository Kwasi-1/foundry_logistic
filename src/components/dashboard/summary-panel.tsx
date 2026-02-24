import React from "react";
import { cn } from "@/lib/utils";
import {
  PackageSearch,
  ArrowUpRight,
  ArrowDownRight,
  Box,
  Layers,
  Truck,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function SummaryPanel() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 lg:p-8 flex flex-col justify-between h-full relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <h3 className="text-xl font-bold tracking-tight text-gray-900 mb-6 relative z-10 flex items-center gap-2">
        <Box className="w-5 h-5 text-primary" />
        Facility Overview
      </h3>

      <div className="space-y-6 relative z-10">
        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <PackageSearch className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded flex items-center gap-0.5">
                +12% <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500 uppercase">
              Total Items
            </p>
            <p className="text-2xl font-bold text-gray-900 leading-tight">
              142,850
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded flex items-center gap-0.5">
                -4% <ArrowDownRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500 uppercase">
              Total Pallets
            </p>
            <p className="text-2xl font-bold text-gray-900 leading-tight">
              4,280
            </p>
          </div>
        </div>

        {/* Utilization Progress */}
        <div className="bg-white border rounded-xl p-4 shadow-sm relative overflow-hidden">
          {/* Progress bar background styling */}
          <div className="mb-2 flex justify-between items-end">
            <span className="text-sm font-medium text-gray-600">
              Zone Utilization
            </span>
            <span className="text-lg font-bold text-primary">82%</span>
          </div>
          <Progress value={82} className="h-2 mb-4" />

          <div className="grid grid-cols-3 gap-2 text-center divide-x">
            <div>
              <p className="text-[10px] uppercase font-semibold text-gray-400">
                Filled
              </p>
              <p className="text-sm font-bold text-gray-800">820</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-gray-400">
                Empty
              </p>
              <p className="text-sm font-bold text-gray-800">180</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-gray-400">
                Locked
              </p>
              <p className="text-sm font-bold text-gray-800">24</p>
            </div>
          </div>
        </div>

        {/* Dispatch Stats list */}
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  Items Dispatched
                </p>
                <p className="text-xs text-gray-500">Last 24 hours</p>
              </div>
            </div>
            <span className="font-semibold text-gray-900">1,240</span>
          </div>

          <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">In Transit</p>
                <p className="text-xs text-gray-500">Active shipments</p>
              </div>
            </div>
            <span className="font-semibold text-gray-900">432</span>
          </div>

          <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                <ArrowDownRight className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  Items Received
                </p>
                <p className="text-xs text-gray-500">Last 24 hours</p>
              </div>
            </div>
            <span className="font-semibold text-gray-900">856</span>
          </div>
        </div>
      </div>
    </div>
  );
}
