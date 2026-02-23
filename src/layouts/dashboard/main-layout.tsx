import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { useAppSelector } from "@/store/store";
import { ReactNode } from "react";
import { SidebarNavItem } from "@/components/ui/sidebar";
import {
  IconlyHome,
  IconlyBankCard,
  IconlyBag,
  IconlyDocument,
} from "./components/icons";
import { usePermission } from "@/hooks/use-permission";
import { PERMISSIONS } from "@/utils/permissions";

export default function MainDashboardLayout({
  children,
}: {
  children: ReactNode;
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
      title: "Home",
      icon: <IconlyHome size={20} />,
      href: "/dashboard",
    },
    {
      title: "Accounting",
      icon: <IconlyBankCard />,
      items: [
        {
          title: "Accounts",
        },
        {
          title: "Chart of Accounts",
        },
        {
          title: "Journal Entries",
        },
      ],
    },
    {
      title: "Sales",
      icon: <IconlyBag size={20} />,
      items: [
        {
          title: "Invoices",
          href: "/dashboard/sales/invoices",
        },
        {
          title: "POS Invoices",
          href: "/dashboard/sales/pos-invoice",
        },
        {
          title: "Customers",
          href: "/dashboard/sales/customers",
        },
      ],
    },
    {
      title: "Purchase",
      icon: <IconlyBankCard size={20} />,
      items: [
        {
          title: "Bills",
          href: "/dashboard/purchase/bills",
        },
        {
          title: "Purchase Orders",
          href: "/dashboard/purchase/purchase-orders",
        },
        {
          title: "Catalog",
          href: "/dashboard/purchase/catalog",
        },
        {
          title: "Categories",
          href: "/dashboard/purchase/categories",
        },
        {
          title: "Suppliers",
          href: "/dashboard/purchase/suppliers",
        },
      ],
    },
    {
      title: "Reports",
      icon: <IconlyDocument size={20} />,
      items: [
        {
          title: "Financial Reports",
        },
        {
          title: "Sales Report",
        },
      ],
    },
  ];

  const filteredSidebarItems = sidebarItems
    .map((item) => {
      const itemPermission = item.href ? navPermissionByHref[item.href] : undefined;
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
      logo={<img src="/images/logo-dark.svg" className="w-5" />}
      appName="Foundry"
      sidebarItems={filteredSidebarItems}
      user={{
        name: userInfo?.name,
        email: userInfo?.email,
        avatar: "",
      }}
    >
      {children}
    </DashboardLayout>
  );
}
