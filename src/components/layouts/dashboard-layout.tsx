import * as React from "react";
import { Menu, X, Bell, Settings, User, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useMoneyMask } from "@/hooks/use-money-mask";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Sidebar, SidebarNavItem } from "../ui/sidebar";
import { useAuth0 } from "@auth0/auth0-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { onLogout } from "@/store/auth/auth.slice";
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
  const [collapsed, setCollapsed] = React.useState(false);
  const { isMasked, toggleMask } = useMoneyMask();
  const navigate = useNavigate();
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
          onCollapsedChange={setCollapsed}
          logo={fullLogo}
          logoIcon={logo}
          headerAction={
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="h-8 w-8"
            >
              <Menu className="h-4 w-4" />
            </Button>
          }
          footer={sidebarFooter}
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
      <div className="flex flex-1 flex-col overflow-hidden ">
        {/* Mobile Menu Button */}
        <header className="sticky top-0 z-30 flex h-16 items-center bg-white px-6 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="h-full px-6 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
