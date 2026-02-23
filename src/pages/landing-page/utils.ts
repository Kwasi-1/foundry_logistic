import { cn } from "@/lib/utils";

export const sidebarItems = [
  {
    id: "business",
    icon: "/icons/books.png",
    label: "Business",
    size: "small",
    link: "/dashboard",
  },
  {
    id: "pos",
    icon: "/icons/pos-sidebar.svg",
    link: "https://pos.foundry-platform.app",
    label: "PoS",
    size: "small",
  },
  {
    id: "users",
    icon: "/icons/users.svg",
    label: "Users",
    size: "small",
    link: "/users",
  },
  // {
  //   id: "organization",
  //   icon: "/icons/organization.svg",
  //   label: "Organization",
  //   size: "small",
  //   link: "/organization/setup",
  // },
  // {
  //   id: "billing",
  //   icon: "/icons/settings.svg",
  //   label: "Billing",
  //   size: "small",
  //   link: "/billing",
  // },
];

type SidebarItem = {
  id: string;
  icon: string;
  label: string;
  size?: "small" | "large";
  link?: string;
  color?: "blue";
  isAction?: boolean;
};

export const getButtonClasses = (item: SidebarItem, activeTab: string) => {
  return cn(
    "rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105",
    item.size === "large" ? "w-12 h-12" : "w-11 h-11",
    {
      "bg-blue-500 shadow-lg": item.id === activeTab && item.color === "blue",
      // "bg-gray-400/20": item.id === activeTab && item.color !== "blue",
      "bg-blue-100 hover:bg-blue-200":
        item.id !== activeTab && item.color === "blue",
      "bg-primary-gray hover:bg-gray-50":
        item.id !== activeTab && item.isAction,
      "bg-gray-100 hover:bg-gray-200":
        item.id !== activeTab &&
        !item.color &&
        !item.isAction &&
        item.size === "large",
      "bg-gray-400/20":
        item.id !== activeTab &&
        !item.color &&
        !item.isAction &&
        item.size !== "large",
    },
  );
};

export const getIconClasses = (item: SidebarItem, activeTab: string) => {
  return cn("w-auto h-5", {
    "text-white": item.id === activeTab,
    "text-blue-600": item.id !== activeTab && item.color === "blue",
    "text-gray-600": item.id !== activeTab && item.color !== "blue",
  });
};
