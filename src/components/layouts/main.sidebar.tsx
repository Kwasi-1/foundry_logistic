import { CustomDropdown } from "@/components/custom.dropdown";
import useMutateApi from "@/hooks/useMutateApi";
import useQueryApi from "@/hooks/useQueryApi";
import useScreenSize from "@/hooks/useScreenSize";
import {
  IconlyAlignleft,
  IconlyBankCarrdai,
  IconlyBuilding,
  IconlyBuildingoffice,
  IconlyDollarrefresh,
  IconlyDowngraph,
  IconlyHome,
  IconlyLedger,
  IconlyPaper,
  IconlyWalletout,
  IconlyWork,
} from "@/icons/Iconly-icons";
import { onResetOrgDetails } from "@/store/features/accounting.setup.details";
import { onLogout as logOut } from "@/store/features/auth.slice";
import { RootState } from "@/store/store";
import { initials } from "@/utils/helpers";
import { variables } from "@/utils/env";
import { useAuth0 } from "@auth0/auth0-react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { lowerCase } from "lodash";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const SidebarComponent = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showProfileActions, setShowProfileActions] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentModule = useSelector((state: RootState) => state.global.module);
  const { organization, userInfo } = useSelector(
    (state: RootState) => state.auth
  );
  const auth = useAuth0();

  async function onLogout() {
    try {
      auth.logout({ logoutParams: { returnTo: window.location.origin } });
      dispatch(logOut());
      dispatch(onResetOrgDetails());
    } catch (error) {
      console.log(error);
    }
  }

  function highlight(tuple: any) {
    if (pathname === `/${tuple[0]}`) return true;

    if (pathname.includes(tuple[0]) && !tuple[1]) return true;

    return false;
  }

  const { data } = useQueryApi({
    key: ["organization-list"],
    url: variables().BASE_URL + "/a89/organization/list",
    params: { full_query: false, uid: userInfo.id },
  });

  const organization_list = data?.map((i: any) => ({
    label: i.name,
    key: i.id,
  }));

  const switch_organizations = organization_list?.length > 1;

  const { mutate: onSwitchSession } = useMutateApi({
    key: ["switch session"],
    url: variables().BASE_URL + "/auth/switch-session",
    async onSuccess() {
      auth.logout({ logoutParams: { returnTo: window.location.origin } });
    },
  });
  const screenSize = useScreenSize();

  return (
    <div
      className={`${
        isSidebarCollapsed ? "w-[70px]" : "w-[230px]"
      } h-full py-4 px-2 border-r transition-all duration-300 ease-in-out flex flex-col`}
    >
      {/* Logo and Toggle Button */}
      <div className="mb-4 flex items-center justify-between">
        {isSidebarCollapsed ? (
          <div className="w-full group relative">
            {/* Logo - hidden on hover */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center justify-center hover:cursor-pointer group-hover:opacity-0 transition-opacity duration-200"
            >
              <img
                src="/icons/logo-dark.svg"
                className="w-[1.3rem]"
                alt="Foundry Logo"
              />
            </div>
            {/* Expand button - shown on hover */}
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-200/10 rounded-md"
              title="Expand sidebar"
            >
              <Icon
                icon="hugeicons:sidebar-left"
                className="text-gray-600"
                fontSize={20}
              />
            </button>
          </div>
        ) : (
          <>
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-x-3 hover:cursor-pointer px-3"
            >
              <img
                src="/icons/logo-dark.svg"
                className="w-[1.0rem]"
                alt="Foundry Logo"
              />
              <div className="flex flex-col mr-auto text-gray-600">
                <h1 className="font-medium capitalize">Foundry</h1>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1 hover:bg-gray-200 rounded-md transition-colors"
              title="Collapse sidebar"
            >
              <Icon
                icon="hugeicons:sidebar-left"
                className="text-gray-600"
                fontSize={20}
              />
            </button>
          </>
        )}
      </div>

      {/* Navigation Links Container - Scrollable */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide scrollbar-thin">
        <div className="flex flex-col w-full mx-auto text-sm">
          {MenuItems(currentModule, [])
            .filter((menuItem) => {
              if (screenSize != "desktop") {
                return Boolean(menuItem?.showOnMobile);
              } else {
                return true;
              }
            })
            .map((item, index) => {
              const isHighlighted = highlight(item.parent);

              return (
                <div
                  key={index}
                  className={`flex flex-col w-full ${
                    isHighlighted && !isSidebarCollapsed && "bg-gray-200/30"
                  } p-1 overflow-hidden duration-150 ease-linear flex-shrink-0`}
                >
                  <button
                    onClick={() => {
                      navigate(item.link);
                      item.link !== "/" && setIsSidebarCollapsed(false);
                    }}
                    className={`${
                      isHighlighted
                        ? `text-black`
                        : "hover:bg-gray-200/10 text-gray-500"
                    } rounded-md p-2 flex flex-row gap-x-3 items-center ${
                      isSidebarCollapsed ? "justify-center" : ""
                    }`}
                    title={isSidebarCollapsed ? item.title : ""}
                  >
                    {typeof item.icon === "string" ? (
                      <Icon
                        icon={item.icon}
                        className={`text-[19px] flex-shrink-0`}
                      />
                    ) : (
                      item.icon
                    )}

                    {!isSidebarCollapsed && (
                      <p className="mt-[2px] whitespace-nowrap">{item.title}</p>
                    )}
                  </button>

                  {isHighlighted && item.sublinks && !isSidebarCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="flex flex-col pl-4"
                    >
                      {item.sublinks.map((sublink, subIndex) => {
                        const isSubHighlighted = highlight(sublink.parent);
                        return (
                          <button
                            key={subIndex}
                            onClick={() => {
                              navigate(sublink.link);
                            }}
                            className={`${
                              isSubHighlighted
                                ? "text-black bg-white"
                                : "hover:bg-gray-200/10 text-gray-500"
                            } p-2 flex flex-row gap-x-3 items-center my-1`}
                          >
                            {typeof sublink.icon === "string" ? (
                              <Icon
                                icon={sublink.icon}
                                className={`hidden text-[19px] ${sublink?.iconStyle}`}
                              />
                            ) : (
                              sublink.icon
                            )}

                            <p className="mt-[2px] ml-[19px] whitespace-nowrap">
                              {sublink.title}
                            </p>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              );
            })}
        </div>
      </nav>

      {/* User Profile Section at Bottom */}
      <div className="flex-shrink-0 flex flex-col mt-auto gap-y-3 pt-4">
        {switch_organizations && !isSidebarCollapsed && (
          <CustomDropdown
            options={organization_list || []}
            label={
              organization_list?.find((i: any) => i.key === organization?.id)
                ?.label
            }
            value={organization?.id}
            onclick={function (key: React.Key): void {
              onSwitchSession({ oid: key });
            }}
            style="text-left px-0 bg-gray-100 w-full"
          />
        )}

        {/* User Profile Card */}
        <div
          className={`bg-gray-100 dark:bg-gray-800 rounded-lg ${
            isSidebarCollapsed ? "flex justify-center p-1" : "p-3"
          }`}
        >
          {isSidebarCollapsed ? (
            <button
              onClick={() => setShowProfileActions(!showProfileActions)}
              className="w-10 h-10 bg-white text-black rounded-full text-center flex items-center justify-center text-xs font-semibold hover:opacity-80 transition-opacity"
              title={userInfo?.name}
            >
              {initials(userInfo?.name)}
            </button>
          ) : (
            <button
              onClick={() => setShowProfileActions(!showProfileActions)}
              className="flex items-center gap-2 w-full hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-white text-black rounded-full text-center flex items-center justify-center text-xs font-semibold">
                {initials(userInfo?.name)}
              </div>
              <div className="flex flex-col flex-1 min-w-0 text-left">
                <p
                  className="text-sm font-semibold text-gray-900 dark:text-white truncate"
                  title={userInfo?.name}
                >
                  {userInfo?.name}
                </p>
                <p
                  className="text-xs text-gray-500 dark:text-gray-400 truncate"
                  title={userInfo?.email}
                >
                  {userInfo?.email}
                </p>
              </div>
              <Icon
                icon={
                  showProfileActions
                    ? "solar:alt-arrow-up-linear"
                    : "solar:alt-arrow-down-linear"
                }
                className="text-gray-500 dark:text-gray-400"
                fontSize={18}
              />
            </button>
          )}

          {/* Actions - Only show when clicked and not collapsed */}
          <AnimatePresence initial={false}>
            {showProfileActions && !isSidebarCollapsed && (
              <motion.div
                initial={{
                  height: 0,
                  opacity: 0,
                  marginTop: 0,
                  paddingTop: 0,
                }}
                animate={{
                  height: "auto",
                  opacity: 1,
                  marginTop: 12,
                  paddingTop: 12,
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                  marginTop: 0,
                  paddingTop: 0,
                }}
                transition={{
                  duration: 0.3,
                  ease: [0.4, 0.0, 0.2, 1],
                }}
                className="flex flex-col gap-1 border-t border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => {
                    navigate("/organization/security");
                    setShowProfileActions(false);
                  }}
                  className="flex items-center gap-2 p-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors w-full"
                >
                  <Icon icon="hugeicons:shield-user" fontSize={18} />
                  <span>Account Security</span>
                </button>

                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 p-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors w-full"
                >
                  <Icon icon="bi:dash-circle" rotate={2} fontSize={18} />
                  <span>Log out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapsed state actions - show as popup */}
          {isSidebarCollapsed && showProfileActions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-20 left-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 p-2 flex flex-col gap-2 z-50"
            >
              <button
                onClick={() => {
                  navigate("/organization/security");
                  setShowProfileActions(false);
                }}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
                title="Account Security"
              >
                <Icon icon="hugeicons:shield-user" fontSize={18} />
              </button>
              <button
                onClick={onLogout}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                title="Log out"
              >
                <Icon icon="bi:dash-circle" rotate={2} fontSize={18} />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarComponent;

interface Links {
  title: string;
  link: string;
  icon: any;
  iconStyle?: string;
  sublinks: Array<{
    title: string;
    link: string;
    icon: any;
    iconStyle?: string;
    parent: any;
  }>;
  parent: any;
  showOnMobile?: boolean;
}

const MenuItems = (currentModule: string, permissions = [""]): Array<Links> => {
  const items = {
    accounting: [
      {
        title: "Home",
        icon: <IconlyHome />,
        link: "/dashboard/accounting",
        parent: ["dashboard/accounting", true],
        permissionsRequired: [],
        sublinks: [],
        showOnMobile: true,
      },
      {
        title: "For You",
        icon: <IconlyAlignleft />,
        link: "/dashboard/accounting/for-you",
        parent: ["for-you", false],
        permissionsRequired: [],
        sublinks: [],
        showOnMobile: true,
      },
      {
        title: "Banking",
        icon: <IconlyBuildingoffice />,
        link: "/dashboard/accounting/banking/transactions",
        parent: ["banking", false],
        permissionsRequired: [],
        sublinks: [
          // {
          //   title: "Accounts",
          //   icon: "hugeicons:wallet-01",
          //   link: "/dashboard/accounting/banking/accounts",
          //   parent: ["accounts", false],
          //   permissionsRequired: [],
          //   sublinks: [],
          // },
          {
            title: "Transactions",
            icon: "hugeicons:transaction",
            link: "/dashboard/accounting/banking/transactions",
            parent: ["transactions", false],
            permissionsRequired: [],
            sublinks: [],
          },
          // {
          //   title: "Transfers",
          //   icon: "hugeicons:money-exchange-01",
          //   link: "/dashboard/accounting/banking/transfers",
          //   parent: ["transfers", false],
          //   permissionsRequired: [],
          //   sublinks: [],
          // },
          {
            title: "Payment Rules",
            icon: "hugeicons:settings-02",
            link: "/dashboard/accounting/banking/payment-rules",
            parent: ["payment-rules", false],
            permissionsRequired: [],
            sublinks: [],
          },
          {
            title: "Treasury Dashboard",
            icon: "hugeicons:analytics-01",
            link: "/dashboard/accounting/banking/treasury-dashboard",
            parent: ["treasury-dashboard", false],
            permissionsRequired: [],
            sublinks: [],
          },
        ],
      },
      {
        title: "Spend Management",
        icon: <IconlyWalletout />,
        link: "/dashboard/accounting/spend-management/cards",
        parent: ["spend-management", false],
        permissionsRequired: [],
        sublinks: [
          {
            title: "Wallet / Cards",
            icon: "hugeicons:credit-card",
            link: "/dashboard/accounting/spend-management/cards",
            parent: ["cards", false],
            permissionsRequired: [],
            sublinks: [],
          },
          {
            title: "Expenses",
            icon: "hugeicons:money-exchange-01",
            link: "/dashboard/accounting/spend-management/expenses",
            parent: ["expenses", false],
            permissionsRequired: [],
            sublinks: [],
          },
          // {
          //   title: "Expense Claims",
          //   icon: "hugeicons:money-exchange-01",
          //   link: "/dashboard/accounting/spend-management/expense-claims",
          //   parent: ["expense-claims", false],
          //   permissionsRequired: [],
          //   sublinks: [],
          // },
          {
            title: "Reimbursements",
            icon: "hugeicons:money-receive-01",
            link: "/dashboard/accounting/spend-management/reimbursements",
            parent: ["reimbursements", false],
            permissionsRequired: [],
            sublinks: [],
          },
          {
            title: "Budgets",
            icon: "iconoir:piggy-bank",
            link: "/dashboard/accounting/spend-management/budgets",
            parent: ["budgets", false],
            permissionsRequired: [],
            sublinks: [],
          },
          {
            title: "Spend Rules",
            icon: "hugeicons:settings-02",
            link: "/dashboard/accounting/spend-management/spend-rules",
            parent: ["spend-rules", false],
            permissionsRequired: [],
            sublinks: [],
          },
        ],
      },
      {
        title: "Accounting",
        icon: <IconlyLedger />,
        link: "/dashboard/accounting/masters/general-ledger",
        parent: ["masters", false],
        permissionsRequired: [],
        sublinks: [
          {
            title: "Accounts",
            icon: "hugeicons:wallet-01",
            link: "/dashboard/accounting/masters/general-ledger",
            parent: ["general-ledger", false],
            permissionsRequired: [],
            sublinks: [],
          },
          {
            title: "Chart of Accounts",
            icon: "hugeicons:hierarchy-files",
            link: "/dashboard/accounting/masters/chart-of-accounts",
            parent: ["chart-of-accounts", false],
            permissionsRequired: [],
            sublinks: [],
          },
          {
            title: "Journal Entries",
            icon: "emojione-monotone:money-bag",
            link: "/dashboard/accounting/masters/journal-entries",
            parent: ["journal-entries", false],
            permissionsRequired: [],
            sublinks: [],
          },
          {
            title: "Bank Reconciliation",
            icon: "hugeicons:bank",
            link: "/dashboard/accounting/masters/bank-reconciliation",
            parent: ["bank-reconciliation", false],
            permissionsRequired: [],
            sublinks: [],
          },
          // {
          //   title: "Recurring Entries",
          //   icon: "hugeicons:repeat",
          //   link: "/dashboard/accounting/masters/recurring-entries",
          //   parent: ["recurring-entries", false],
          //   permissionsRequired: [],
          //   sublinks: [],
          // },
          // {
          //   title: "Audit Trail",
          //   icon: "emojione-monotone:money-bag",
          //   link: "/dashboard/accounting/masters/audit-trail",
          //   parent: ["audit-trail", false],
          //   permissionsRequired: [],
          //   sublinks: [],
          // },
        ],
        showOnMobile: true,
      },

      {
        title: "Sales",
        icon: <IconlyWork />,
        link: "/dashboard/accounting/sales/sales-invoices",
        parent: ["sales", false],
        permissionsRequired: [],
        sublinks: [
          {
            title: "Invoices",
            icon: "hugeicons:invoice",
            link: "/dashboard/accounting/sales/sales-invoices",
            parent: ["sales-invoices", false],
            permissionsRequired: [],
            sublinks: [],
          },
          {
            title: "POS Invoices",
            icon: "hugeicons:invoice",
            link: "/dashboard/accounting/sales/pos-invoices",
            parent: ["pos-invoices", false],
            permissionsRequired: [],
            sublinks: [],
          },
          {
            title: "Customers",
            icon: "hugeicons:user-group",
            link: "/dashboard/accounting/sales/customers",
            parent: ["customers", false],
            permissionsRequired: [],
            sublinks: [],
          },
          {
            title: "Quotes & Estimates",
            icon: "hugeicons:file-02",
            link: "/dashboard/accounting/sales/quotes-estimates",
            parent: ["quotes-estimates", false],
            permissionsRequired: [],
            sublinks: [],
          },
          {
            title: "Collections",
            icon: "hugeicons:money-receive-circle",
            link: "/dashboard/accounting/sales/collections",
            parent: ["collections", false],
            permissionsRequired: [],
            sublinks: [],
          },
        ],
        showOnMobile: true,
      },
      {
        title: "Purchases",
        icon: <IconlyBankCarrdai />,
        link: "/dashboard/accounting/purchases/bills",
        parent: ["purchases", false],
        permissionsRequired: [],
        sublinks: [
          {
            title: "Bills",
            icon: "hugeicons:cash-01",
            link: "/dashboard/accounting/purchases/bills",
            parent: ["bills", false],
            permissionsRequired: [],
            sublinks: [],
          },
          {
            title: "Suppliers",
            icon: "hugeicons:user-group",
            link: "/dashboard/accounting/purchases/suppliers",
            parent: ["suppliers", false],
            permissionsRequired: [],
            sublinks: [],
          },
          {
            title: "Catalog",
            icon: "hugeicons:file-02",
            link: "/dashboard/accounting/purchases/items",
            parent: ["items", false],
            permissionsRequired: [],
            sublinks: [],
          },
          {
            title: "Purchase Orders",
            icon: "hugeicons:file-02",
            link: "/dashboard/accounting/purchases/purchase-orders",
            parent: ["purchase-orders", false],
            permissionsRequired: [],
            sublinks: [],
          },
          {
            title: "Payments",
            icon: "hugeicons:money-send-circle",
            link: "/dashboard/accounting/purchases/payments",
            parent: ["payments", false],
            permissionsRequired: [],
            sublinks: [],
          },
        ],
      },
      {
        title: "Credit & Lending",
        icon: <IconlyDollarrefresh />,
        link: "/dashboard/accounting/credit-and-lending",
        parent: ["credit-and-lending", false],
        permissionsRequired: [],
        sublinks: [
          {
            title: "Credit Line",
            icon: "hugeicons:credit-card",
            link: "/dashboard/accounting/credit-and-lending/credit-line",
            parent: ["credit-line", false],
            permissionsRequired: [],
            sublinks: [],
          },
          {
            title: "Loan Applications",
            icon: "hugeicons:file-02",
            link: "/dashboard/accounting/credit-and-lending/loan-applications",
            parent: ["loan-applications", false],
            permissionsRequired: [],
            sublinks: [],
          },
          {
            title: "Repayment Schedule",
            icon: "hugeicons:calendar-03",
            link: "/dashboard/accounting/credit-and-lending/repayment-schedule",
            parent: ["repayment-schedule", false],
            permissionsRequired: [],
            sublinks: [],
          },
          {
            title: "Eligibility Insights",
            icon: "hugeicons:analytics-01",
            link: "/dashboard/accounting/credit-and-lending/eligibility-insights",
            parent: ["eligibility-insights", false],
            permissionsRequired: [],
            sublinks: [],
          },
          {
            title: "Collateral Vault",
            icon: "hugeicons:safe",
            link: "/dashboard/accounting/credit-and-lending/collateral-vault",
            parent: ["collateral-vault", false],
            permissionsRequired: [],
            sublinks: [],
          },
        ],
      },
      {
        title: "Staff Management",
        icon: <IconlyDowngraph />,
        link: "/dashboard/accounting/staff-management/employees",
        parent: ["staff-management", false],
        permissionsRequired: [],
        sublinks: [
          {
            title: "Employees",
            icon: "hugeicons:user-group",
            link: "/dashboard/accounting/staff-management/employees",
            parent: ["employees", false],
            permissionsRequired: [],
            sublinks: [],
          },
          {
            title: "Payroll",
            icon: "fluent:receipt-20-regular",
            link: "/dashboard/accounting/staff-management/payroll",
            parent: ["payroll", false],
            permissionsRequired: [],
            sublinks: [],
          },
          {
            title: "Deductions & Benefits",
            icon: "hugeicons:money-bag-02",
            link: "/dashboard/accounting/staff-management/deductions-benefits",
            parent: ["deductions-benefits", false],
            permissionsRequired: [],
            sublinks: [],
          },
          // {
          //   title: "Pay Slips",
          //   icon: "fluent:receipt-20-regular",
          //   link: "/dashboard/accounting/staff-management/pay-slips",
          //   parent: ["pay-slips", false],
          //   permissionsRequired: [],
          //   sublinks: [],
          // },
          // {
          //   title: "Compliance Reports",
          //   icon: "hugeicons:document-validation",
          //   link: "/dashboard/accounting/staff-management/compliance-reports",
          //   parent: ["compliance-reports", false],
          //   permissionsRequired: [],
          //   sublinks: [],
          // },
        ],
      },
      {
        title: "Taxes",
        icon: <IconlyBuilding />,
        link: "/dashboard/accounting/taxes",
        parent: ["taxes", false],
        permissionsRequired: [],
        sublinks: [
          // {
          //   title: "Accounts",
          //   icon: "carbon:cloud-monitoring",
          //   link: "/dashboard/accounting/settings/tree",
          //   parent: ["dashboard/accounting/settings/tree", true],
          //   permissionsRequired: [],
          //   sublinks: [],
          // },

          {
            title: "taxes",
            icon: "solar:document-broken",
            link: "/dashboard/accounting/taxes",
            parent: ["taxes", false],
            permissionsRequired: [],
            sublinks: [],
          },
        ],
      },
      {
        title: "Reports",
        icon: <IconlyPaper />,
        link: "/dashboard/accounting/reports",
        parent: ["report", false],
        permissionsRequired: [],
        sublinks: [
          {
            title: "Financial Reports",
            icon: "hugeicons:document-validation",
            link: "/dashboard/accounting/reports",
            parent: ["dashboard/accounting/reports", true],
            permissionsRequired: [],
            sublinks: [],
          },
          {
            title: "Audit Logs",
            icon: "grommet-icons:system",
            link: "/dashboard/accounting/reports/logs",
            parent: ["dashboard/accounting/reports/logs", true],
            permissionsRequired: [],
            sublinks: [],
          },
        ],
      },
    ],
    "hrms-payroll": [
      {
        title: "Overview",
        icon: "hugeicons:home-01",
        link: "/dashboard/hrms-payroll",
        parent: ["dashboard/hrms-payroll", true],
        permissionsRequired: [],
        sublinks: [],
      },
      {
        title: "Payroll",
        icon: "fluent:payment-wireless-16-regular",
        link: "/dashboard/hrms-payroll/payroll",
        parent: ["dashboard/hrms-payroll/payroll", true],
        permissionsRequired: [],
        sublinks: [],
      },
      {
        title: "Employees",
        icon: "solar:users-group-two-rounded-broken",
        link: "/dashboard/hrms-payroll/employees",
        parent: ["dashboard/hrms-payroll/employees", true],
        permissionsRequired: [],
        sublinks: [],
      },
      {
        title: "Recruitment",
        icon: "fluent:people-search-20-regular",
        link: "/dashboard/hrms-payroll/recruitment",
        parent: ["dashboard/hrms-payroll/recruitment", true],
        permissionsRequired: [],
        sublinks: [],
      },

      // {
      //   title: 'Performance',
      //   icon: 'eos-icons:performance',
      //   link: '/dashboard/hrms-payroll/performance',
      //   parent: ['dashboard/hrms-payroll/performance', true],
      //   permissionsRequired: [],
      //   sublinks: [],
      // },
      // {
      //   title: 'Settings',
      //   icon: 'solar:settings-linear',
      //   link: '/dashboard/hrms-payroll/settings',
      //   parent: ['dashboard/hrms-payroll/settings', true],
      //   permissionsRequired: [],
      //   sublinks: [],
      // },
    ],
  }[currentModule] as unknown as Array<Links>;

  const availableGlobalModules = [];

  const extractModules = new Set(
    permissions.map((i) => lowerCase(i.split(":")[1]))
  );

  availableGlobalModules.forEach((i: any) => {
    if (Array.from(extractModules).includes(i.id)) {
      items.push(i);
    }
  });

  return items;
};

export interface IOrganzationList {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  sector: string;
  code: string;
  verifiedForAPISandbox: boolean;
}
