import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { getButtonClasses, getIconClasses, sidebarItems } from "../utils";
import { useState } from "react";

export default function LandingPageSideBar() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("books");

  return (
    <motion.div className="w-20 flex flex-col items-center py-6 space-y-4 rounded-l-3xl h-full landingfont tracking-widest">
      <Link to="/">
        <img
          src="/images/logo-dark.svg"
          alt="Foundry Logo"
          className="w-6 h-auto"
        />
      </Link>
      {sidebarItems.map((item: any) => (
        <>
          <motion.div
            key={item.id}
            className="flex flex-col items-center space-y-1"
          >
            <motion.button
              onClick={() => {
                setActiveTab(item.id);
                if (String(item.link).match("^https://.*")) {
                  window.open(item.link, "_blank");
                } else {
                  navigate(item.link);
                }
              }}
              className={getButtonClasses(item, activeTab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={item.icon}
                className={getIconClasses(item, activeTab)}
                alt={item.label}
              />
            </motion.button>
            {item.label && (
              <motion.div
                className={cn(
                  "text-[12px] text-center transition-colors",
                  activeTab === item.id
                    ? "text-black font-medium"
                    : "text-gray-600",
                )}
              >
                {item.label}
              </motion.div>
            )}
          </motion.div>
        </>
      ))}
    </motion.div>
  );
}
