import DashboardContainer from "@/components/ui/dashboard-container";
import { apiClient } from "@/lib/api";
import { variables } from "@/utils/env";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import PartyInvoicesTable from "./components/party-invoices-table";
import { PageTitle } from "@/components/ui/page-title";
import { capitalize } from "lodash";
import PartyStats from "./components/party-stats";

function SingleParty() {
  const [params] = useSearchParams();
  const name = params.get("name");
  const type = params.get("type");
  const { data: PartyData, isPending } = useQuery({
    queryKey: ["single-party", name, type],
    queryFn: async () => {
      const { data: Response } = await apiClient({
        url: variables().BUSINESS_API + "/core/get/" + type,
        params: {
          name,
        },
        method: "Get",
      });
      return Response?.data || {};
    },
  });

  const vitals = [
    {
      title: "Name",
      value: String(PartyData?.customer_name || PartyData?.supplier_name || ""),
      extraClasses: "",
    },
    {
      title: "Type",
      value: String(PartyData?.customer_type || PartyData?.supplier_type),
      extraClasses: "",
    },
    {
      title: "Mobile No.",
      value: String(PartyData?.mobile_no || "-"),
      extraClasses: "",
    },
    {
      title: "Email",
      value: String(PartyData?.email_id || PartyData?.contact_mail || "-"),
      extraClasses: "text-[green] capitalize",
    },
    {
      title: "Primary Contact",
      value: String(PartyData?.primary_contact || "-"),
      extraClasses: "",
    },
    {
      title: "Primary Address",
      value: String(PartyData?.primary_address || "")
        .split("<br>")
        .join(" - "),
      extraClasses: "",
    },
  ];

  const normalizedInvoices = useMemo(() => {
    const transactions = Array.isArray(PartyData?.transactions)
      ? PartyData.transactions
      : [];
    return transactions.map((txn: any) => {
      const invoicedAmount = Number(
        txn.base_grand_total ?? txn.grand_total ?? 0,
      );
      const outstandingAmount = Number(txn.outstanding_amount ?? 0);
      const paidAmount =
        Number(txn.paid_amount ?? 0) ||
        Math.max(0, invoicedAmount - outstandingAmount);
      const common = {
        id: txn.name ?? "",
        date: txn.posting_date || txn.creation || "",
        invoiceNumber: txn.name || "",
        invoicedAmount,
        paidAmount,
        outstandingAmount,
        status: txn.status || "pending",
        dueDate: txn.due_date || txn.posting_date || "",
      };

      if (type === "supplier") {
        return {
          ...common,
          party:
            txn.supplier_name || txn.supplier || txn.customer_name || "Unknown",
        };
      }

      return {
        ...common,
        supplier: txn.customer_name || txn.customer || "Unknown",
      };
    });
  }, [PartyData, type]);
  return (
    <div className="grid grid-cols-1 gap-4">
      <PageTitle
        title={capitalize(type)}
        size="lg"
        className="pl-0 pt-0 pb-0"
      />

      <DashboardContainer
        title={name}
        headerClassName="text-[2rem]"
        contentClassName="grid grid-cols-3 gap-4"
        loading={isPending}
      >
        {vitals.map((i) => (
          <div className="flex flex-col gap-y-1 text-sm">
            <h4 className="uppercase text-xs font-medium text-gray-500">
              {i.title}
            </h4>
            <p>{i.value}</p>
          </div>
        ))}
      </DashboardContainer>
      <PartyStats {...PartyData?.summary} loading={isPending} />
      <PartyInvoicesTable
        partyName={name}
        partyType={type}
        invoices={normalizedInvoices}
        loading={isPending}
      />
    </div>
  );
}

export default SingleParty;
