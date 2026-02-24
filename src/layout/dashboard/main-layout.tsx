import { DashboardLayout } from "@/layout/dashboard-layout";
import { useAppSelector } from "@/store/store";
import { ReactNode } from "react";
import { SidebarNavItem } from "@/components/ui/sidebar";
import {
  IconlyHome,
  IconlyDeliveryBox2,
  IconlyStore,
  IconlyBuilding,
  IconlyBuildingoffice,
  IconlyPaper,
  IconlyWork,
} from "@/icons/Iconly-icons";
import { usePermission } from "@/hooks/use-permission";
import { PERMISSIONS } from "@/utils/permissions";
import { Outlet } from "react-router-dom";

export default function MainDashboardLayout({
  children,
}: {
  children?: ReactNode;
}) {
  const { userInfo } = useAppSelector((s) => s.auth);
  const { can } = usePermission();

  const canAny = (permissions: string[]) =>
    permissions.some((permission) => can(permission));

  const navPermissionByHref: Record<string, string> = {
    "/dashboard": PERMISSIONS.dashboardHome,
    "/dashboard/sales/invoices": PERMISSIONS.salesInvoicesList,
    "/dashboard/sales/pos-invoice": PERMISSIONS.salesPosInvoicesList,
    "/dashboard/sales/customers": PERMISSIONS.salesCustomersList,
    "/dashboard/purchase/bills": PERMISSIONS.purchaseBillsList,
    "/dashboard/purchase/purchase-orders": PERMISSIONS.purchaseOrdersList,
    "/dashboard/purchase/catalog": PERMISSIONS.purchaseCatalogList,
    "/dashboard/purchase/categories": PERMISSIONS.purchaseCategoriesList,
    "/dashboard/purchase/suppliers": PERMISSIONS.purchaseSuppliersList,
  };

  const navPermissionByTitle: Record<string, string[]> = {
    Accounting: [
      PERMISSIONS.accountingAccountsView,
      PERMISSIONS.accountingChartOfAccountsView,
      PERMISSIONS.accountingJournalEntriesView,
    ],
    Reports: [PERMISSIONS.reportsFinancialView, PERMISSIONS.reportsSalesView],
  };
  const navPermissionByLabel: Record<string, string> = {
    Accounts: PERMISSIONS.accountingAccountsView,
    "Chart of Accounts": PERMISSIONS.accountingChartOfAccountsView,
    "Journal Entries": PERMISSIONS.accountingJournalEntriesView,
    "Financial Reports": PERMISSIONS.reportsFinancialView,
    "Sales Report": PERMISSIONS.reportsSalesView,
  };

  const sidebarItems: SidebarNavItem[] = [
    {
      title: "Dashboard",
      icon: <IconlyHome size={20} />,
      href: "/dashboard",
    },
    {
      title: "Inventory",
      icon: <IconlyStore size={20} />,
      items: [
        { title: "All Items", href: "/dashboard/inventory/items" },
        { title: "Stock Levels", href: "/dashboard/inventory/stock" },
        { title: "Categories", href: "/dashboard/inventory/categories" },
      ],
    },
    {
      title: "Orders",
      icon: <IconlyWork size={20} />,
      items: [
        { title: "Sales Orders", href: "/dashboard/orders/sales" },
        { title: "Purchase Orders", href: "/dashboard/orders/purchase" },
      ],
    },
    {
      title: "Shipments",
      icon: <IconlyDeliveryBox2 size={20} />,
      items: [
        { title: "Inbound", href: "/dashboard/shipments/inbound" },
        { title: "Outbound", href: "/dashboard/shipments/outbound" },
        { title: "Tracking", href: "/dashboard/shipments/tracking" },
      ],
    },
    {
      title: "Warehouses",
      icon: <IconlyBuilding size={20} />,
      items: [
        { title: "Locations", href: "/dashboard/warehouses/locations" },
        {
          title: "Internal Transfers",
          href: "/dashboard/warehouses/transfers",
        },
      ],
    },
    {
      title: "Partners",
      icon: <IconlyBuildingoffice size={20} />,
      items: [
        { title: "Customers", href: "/dashboard/partners/customers" },
        { title: "Suppliers", href: "/dashboard/partners/suppliers" },
        { title: "Carriers", href: "/dashboard/partners/carriers" },
      ],
    },
    {
      title: "Reports",
      icon: <IconlyPaper size={20} />,
      items: [
        { title: "Inventory Report", href: "/dashboard/reports/inventory" },
        { title: "Shipping Report", href: "/dashboard/reports/shipping" },
      ],
    },
  ];

  const filteredSidebarItems = sidebarItems
    .map((item) => {
      const itemPermission = item.href
        ? navPermissionByHref[item.href]
        : undefined;
      const sectionPermissions = navPermissionByTitle[item.title];
      const filteredSubItems = item.items?.filter((subItem) => {
        const subPermission = subItem.href
          ? navPermissionByHref[subItem.href]
          : navPermissionByLabel[subItem.title];
        return subPermission ? can(subPermission) : true;
      });

      if (filteredSubItems && filteredSubItems.length > 0) {
        return { ...item, items: filteredSubItems };
      }

      if (itemPermission) {
        return can(itemPermission) ? item : null;
      }

      if (sectionPermissions) {
        return canAny(sectionPermissions) ? item : null;
      }

      return item;
    })
    .filter((item): item is SidebarNavItem => item !== null);

  return (
    <DashboardLayout
      showNotifications={false}
      className=""
      logo={
        <img src="/images/logo-dark.svg" className="w-5" alt="Foundry logo" />
      }
      appName="Foundry"
      sidebarItems={filteredSidebarItems}
      user={{
        name: userInfo?.name,
        email: userInfo?.email,
        avatar: "",
      }}
    >
      {/* <Outlet /> renders the matched child route (e.g. DashboardPage at /dashboard) */}
      <Outlet />
    </DashboardLayout>
  );
}
