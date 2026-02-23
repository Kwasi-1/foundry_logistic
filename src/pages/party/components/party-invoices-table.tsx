import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import DashboardContainer from "@/components/ui/dashboard-container";
import { DataTable } from "@/components/ui/data-table";
import { useMoneyMask } from "@/hooks/use-money-mask";
import { DateSelectorValue } from "@/components/ui/date-selector";
import { getSalesInvoiceColumns } from "@/pages/invoices/components/sales-invoice/sales-invoice-columns";
import { getPurchaseInvoiceColumns } from "@/pages/bills/components/purchase-invoice/purchase-invoice-columns";
import {
  SalesInvoice,
  statusFilters as salesStatusFilters,
} from "@/pages/invoices/components/sales-invoice/sales-invoice-types";
import {
  PurchaseInvoice,
  statusFilters as purchaseStatusFilters,
} from "@/pages/bills/components/purchase-invoice/purchase-invoice-types";
import { PaymentEntryModal } from "@/components/modals/payment-entry-modal";
import { apiClient } from "@/lib/api";
import { variables } from "@/utils/env";
import { usePermission } from "@/hooks/use-permission";
import { PERMISSIONS } from "@/utils/permissions";

type PartyInvoicesTableProps = {
  partyName: string | null;
  partyType: string | null;
  invoices: Array<SalesInvoice | PurchaseInvoice>;
  loading?: boolean;
};

export default function PartyInvoicesTable({
  partyName,
  partyType,
  invoices,
  loading = false,
}: PartyInvoicesTableProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isMasked } = useMoneyMask();
  const { can } = usePermission();
  const canViewSales = can(PERMISSIONS.salesInvoicesView);
  const canViewPurchase = can(PERMISSIONS.purchaseBillsView);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(10);
  const [dateRange, setDateRange] = useState<DateSelectorValue>({
    mode: "range",
    startDate: null,
    endDate: null,
  });
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    invoiceId: string;
    outstandingAmount: number;
  }>({ isOpen: false, invoiceId: "", outstandingAmount: 0 });

  const isPurchase = partyType === "supplier";
  const trimmedSearch = searchQuery.trim();
  const isNameSearch = /^\d/.test(trimmedSearch);
  const fromDate = dateRange.mode === "range" ? dateRange.startDate : null;
  const toDate = dateRange.mode === "range" ? dateRange.endDate : null;

  const entries = useMemo(() => {
    return Array.isArray(invoices) ? invoices : [];
  }, [invoices]);

  const filteredData = useMemo(() => {
    return entries.filter((invoice) => {
      const partyLabel = "party" in invoice ? invoice.party : invoice.supplier;
      const matchesStatus =
        statusFilter === "All Statuses" ||
        invoice.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesSearch = trimmedSearch
        ? isNameSearch
          ? invoice.invoiceNumber
              .toLowerCase()
              .includes(trimmedSearch.toLowerCase())
          : partyLabel.toLowerCase().includes(trimmedSearch.toLowerCase())
        : true;

      const invoiceDate = new Date(invoice.date);
      const matchesFromDate = fromDate
        ? invoiceDate >= new Date(fromDate)
        : true;
      const matchesToDate = toDate ? invoiceDate <= new Date(toDate) : true;

      const matchesParty = partyName
        ? partyLabel === partyName
        : true;

      return (
        matchesStatus &&
        matchesSearch &&
        matchesFromDate &&
        matchesToDate &&
        matchesParty
      );
    });
  }, [
    entries,
    statusFilter,
    trimmedSearch,
    isNameSearch,
    isPurchase,
    fromDate,
    toDate,
    partyName,
  ]);

  const firstIndexByDate = useMemo(() => {
    const map = new Map<string, number>();
    filteredData.forEach((invoice, index) => {
      if (!map.has(invoice.date)) {
        map.set(invoice.date, index);
      }
    });
    return map;
  }, [filteredData]);

  const handleRecordPayment = (
    invoiceId: string,
    outstandingAmount: number,
  ) => {
    setPaymentModal({ isOpen: true, invoiceId, outstandingAmount });
  };

  const voidInvoiceMutation = useMutation({
    mutationFn: async (invoiceId: string) =>
      await apiClient({
        url: `${variables().BUSINESS_API}/core/misc/cancel`,
        method: "GET",
        params: {
          doctype: isPurchase ? "Purchase Invoice" : "Sales Invoice",
          name: invoiceId,
        },
      }),
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to void invoice";
      toast.error(errorMessage);
    },
    onSuccess: () => {
      toast.success("Invoice voided");
      queryClient.invalidateQueries({ queryKey: ["list-sales-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["list-purchase-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["party-invoices"] });
    },
  });

  const handleVoidInvoice = (invoiceId: string) => {
    voidInvoiceMutation.mutate(invoiceId);
  };

  const handleViewInvoice = (invoiceNumber: string) => {
    const type = isPurchase ? "purchase" : "sales";
    navigate(`/dashboard/invoice/view?name=${invoiceNumber}&type=${type}`);
  };

  const columns = useMemo<ColumnDef<SalesInvoice | PurchaseInvoice>[]>(
    () =>
      (isPurchase
        ? getPurchaseInvoiceColumns({
            isMasked,
            firstIndexByDate,
            canView: canViewPurchase,
            onRecordPayment: handleRecordPayment,
            onViewInvoice: handleViewInvoice,
            onVoidInvoice: handleVoidInvoice,
          })
        : getSalesInvoiceColumns({
            isMasked,
            firstIndexByDate,
            canView: canViewSales,
            onRecordPayment: handleRecordPayment,
            onViewInvoice: handleViewInvoice,
            onVoidInvoice: handleVoidInvoice,
          })) as ColumnDef<SalesInvoice | PurchaseInvoice>[],
    [isMasked, firstIndexByDate, isPurchase, canViewPurchase, canViewSales],
  );

  return (
    <DashboardContainer
      title={isPurchase ? "Bills" : "Invoices"}
      className=""
      contentClassName="min-h-[670px]"
    >
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={filteredData}
          enablePagination={true}
          enableColumnVisibility={false}
          enablePageSizeSelector={false}
          pageSize={pageSize}
          pageIndex={pageIndex}
          onPageIndexChange={setPageIndex}
          loading={loading}
          onRowClick={
            (isPurchase ? canViewPurchase : canViewSales)
              ? (row) => {
                  const type = isPurchase ? "purchase" : "sales";
                  navigate(
                    `/dashboard/invoice/view?name=${row.invoiceNumber}&type=${type}`,
                  );
                }
              : undefined
          }
        />
      </div>

      <PaymentEntryModal
        isOpen={paymentModal.isOpen}
        onClose={() =>
          setPaymentModal({
            isOpen: false,
            invoiceId: "",
            outstandingAmount: 0,
          })
        }
        invoiceId={paymentModal.invoiceId}
        outstandingAmount={paymentModal.outstandingAmount}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["list-sales-invoices"] });
          queryClient.invalidateQueries({ queryKey: ["list-purchase-invoices"] });
          queryClient.invalidateQueries({ queryKey: ["party-invoices"] });
        }}
      />
    </DashboardContainer>
  );
}
