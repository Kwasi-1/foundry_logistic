import { StatCard } from "@/components/dashboard/stat-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { PageTitle } from "@/components/ui/page-title";

const MOCK_ACTIVITIES = [
  {
    id: "1",
    user: { name: "Kwesi Kusi" },
    action: "Received 500 units of Solar Panels at Warehouse A",
    timestamp: "2 hours ago",
    type: "success" as const,
  },
  {
    id: "2",
    user: { name: "Ama Serwaa" },
    action: "Order #PO-2024-001 created for 200 Lithium Batteries",
    timestamp: "5 hours ago",
    type: "info" as const,
  },
  {
    id: "3",
    user: { name: "System" },
    action: "Low stock alert: Inverter X10 (only 5 units remaining)",
    timestamp: "Yesterday",
    type: "warning" as const,
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <PageTitle title="Logistics Overview" />

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Shipments" value="1,280" />
        <StatCard label="Inbound Orders" value="45" />
        <StatCard label="Outbound Orders" value="12" />
        <StatCard label="Warehouse Capacity" value="78%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity activities={MOCK_ACTIVITIES} />
        </div>

        <div className="space-y-4">
          <div className="rounded-lg bg-white p-6 shadow-sm border">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
              Quick Links
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <button className="text-left py-2 px-3 hover:bg-gray-50 rounded text-sm text-primary-cct">
                Add New Item
              </button>
              <button className="text-left py-2 px-3 hover:bg-gray-50 rounded text-sm text-primary-cct">
                Create Purchase Order
              </button>
              <button className="text-left py-2 px-3 hover:bg-gray-50 rounded text-sm text-primary-cct">
                Register Shipment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
