import * as React from "react";
import { Menu, X, Bell, Settings, User, Eye, EyeOff } from "lucide-react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMoneyMask } from "@/hooks/use-money-mask";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar, SidebarNavItem } from "@/components/ui/sidebar";
import { useAuth0 } from "@auth0/auth0-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { onLogout } from "@/store/features/auth.slice";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { variables } from "@/utils/env";

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarItems: SidebarNavItem[];
  logo?: React.ReactNode;
  appName?: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onSearch?: (query: string) => void;
  className?: string;
  showNotifications?: boolean;
}

export function DashboardLayout({
  children,
  sidebarItems,
  logo,
  appName,
  user,
  className,
  showNotifications = true,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(true);
  const { isMasked, toggleMask } = useMoneyMask();
  const navigate = useNavigate();
  const location = useLocation();
  // When on the main dashboard, the sidebar floats over the hero — make it transparent & locked
  const isWarehouseHome = location.pathname === "/dashboard";

  // Auto-collapse when entering /dashboard, auto-expand when leaving
  React.useEffect(() => {
    if (isWarehouseHome) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [isWarehouseHome]);
  const { logout } = useAuth0();
  const { userInfo, organization } = useAppSelector((s) => s.auth);

  const { data: organization_list } = useQuery({
    queryKey: ["all-organizations", userInfo.id],

    queryFn: async () => {
      const { data } = await apiClient({
        params: { full_query: false, uid: userInfo.id },
        url: variables().DASHBOARD_API + "/a89/organization/list",
        method: "GET",
      });

      return data.data;
    },
  });

  const { mutate: SwitchSession } = useMutation({
    mutationKey: ["switch-session"],
    mutationFn: async (oid) => {
      await apiClient({
        url: variables().DASHBOARD_API + "/auth/switch-session",
        method: "POST",
        data: {
          oid,
        },
      });
    },
    onSuccess: () => {
      handleLogout();
    },
  });

  const orgs = (organization_list ?? []).map((i: any) => ({
    label: i?.name,
    key: i?.id,
  }));
  const activeOrgId = organization?.id;
  const activeOrgLabel = organization?.name;

  const dispatch = useAppDispatch();

  async function handleLogout() {
    await logout({ logoutParams: { returnTo: window.location.origin } });
    dispatch(onLogout());
  }

  const sidebarFooter = (
    <div className="space-y-3">
      {/* Footer Controls */}
      <div
        className={cn(
          "flex gap-2",
          collapsed ? "flex-col items-center" : "items-center justify-between",
        )}
      >
        {/* Money Mask Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMask}
          title={isMasked ? "Show money amounts" : "Hide money amounts"}
          className="h-9 w-9"
        >
          {isMasked ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>

        {/* Notifications */}
        {showNotifications && (
          <Button variant="ghost" size="icon" className="relative h-9 w-9">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
          </Button>
        )}
      </div>

      {/* User Menu */}
      {!collapsed && orgs.length > 1 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-auto w-full justify-between px-3 py-2 text-sm font-medium hover:bg-gray-50"
            >
              <span>{activeOrgLabel || "Organizations"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {orgs.map((org) => (
              <DropdownMenuItem
                key={org.key}
                disabled={org.key === activeOrgId}
                onClick={() => {
                  SwitchSession(org.key);
                }}
              >
                {org.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {!collapsed && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-auto w-full gap-3 px-3 py-2 hover:bg-gray-50"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col text-left">
                <p className="text-sm font-medium leading-none">
                  {user?.name || "User"}
                </p>
                <p className="mt-1 text-xs leading-none text-muted-foreground">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                handleLogout();
              }}
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );

  const fullLogo =
    logo && appName ? (
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => {
          navigate("/");
        }}
      >
        {logo}
        {!collapsed && (
          <span className="text-lg font-semibold text-gray-900">{appName}</span>
        )}
      </div>
    ) : (
      logo
    );

  const mobileLogo =
    logo && appName ? (
      <div className="flex items-center gap-2">
        {logo}
        <span className="text-lg font-semibold text-gray-900">{appName}</span>
      </div>
    ) : (
      logo
    );

  return (
    <div className={cn("flex h-screen overflow-hidden bg-gray-50 ", className)}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          items={sidebarItems}
          collapsed={collapsed}
          onCollapsedChange={isWarehouseHome ? undefined : setCollapsed}
          logo={fullLogo}
          logoIcon={logo}
          headerAction={
            // Hide the collapse toggle on the warehouse dashboard — sidebar is locked collapsed
            !isWarehouseHome ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCollapsed(!collapsed)}
                className="h-8 w-8"
              >
                <Menu className="h-4 w-4" />
              </Button>
            ) : undefined
          }
          footer={sidebarFooter}
          className={cn(
            "transition-colors duration-300",
            isWarehouseHome
              ? "bg-transparent border-r border-white/10 [&_button]:text-white [&_span]:text-white/70"
              : "bg-white border-r border-primary-gray/70",
          )}
        />
      </div>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <Sidebar
              items={sidebarItems}
              logo={mobileLogo}
              logoIcon={logo}
              className={cn(
                isWarehouseHome
                  ? "bg-black/60 backdrop-blur-md border-r border-white/10 [&_button]:text-white [&_span]:text-white/70"
                  : "bg-white",
              )}
              footer={
                <div className="space-y-3">
                  {sidebarFooter}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(false)}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Close
                  </Button>
                </div>
              }
            />
          </div>
        </>
      )}
      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Menu Button — transparent on warehouse home */}
        <header
          className={cn(
            "sticky top-0 z-30 flex h-14 items-center px-4 lg:hidden transition-colors duration-300",
            isWarehouseHome ? "bg-transparent" : "bg-white border-b",
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className={cn(isWarehouseHome && "text-white hover:bg-white/20")}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </header>

        {/* Page Content — no padding/bg on warehouse home so the hero bleeds edge-to-edge */}
        <main
          className={cn(
            "flex-1 overflow-y-auto transition-colors duration-300",
            isWarehouseHome ? "bg-transparent" : "bg-white",
          )}
        >
          <div className={cn("h-full", isWarehouseHome ? "p-0" : "p-0")}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
