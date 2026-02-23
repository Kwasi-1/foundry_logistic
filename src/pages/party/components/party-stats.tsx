import { StatCard } from "@/components/dashboard/stat-card";
import DashboardContainer from "@/components/ui/dashboard-container";

function PartyStats({
  number_of_txns,
  total_amount,
  total_paid,
  loading,
}: {
  number_of_txns: number;
  total_amount: number;
  total_paid: number;
  loading: boolean;
}) {
  const stat_items = [
    {
      label: "Number of Transactions",
      value: number_of_txns || 0,
    },
    {
      label: "Total Invoiced Amount",
      value: "GHS" + (total_amount || 0),
    },
    {
      label: "Total Paid",
      value: "GHS" + (total_paid || 0),
    },
    {
      label: "Total Outstanding",
      value: "GHS" + (total_amount - total_paid || 0),
    },
  ];

  return (
    <DashboardContainer
      contentClassName="grid grid-cols-4 relative"
      loading={loading}
    >
      {stat_items.map((item) => (
        <StatCard label={item.label} value={item.value} />
      ))}
    </DashboardContainer>
  );
}

export default PartyStats;
