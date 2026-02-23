// import { Icon } from "@iconify/react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

interface AppCard {
  id: string;
  title: string;
  description: string;
  lastAccessed: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  link?: string;
}

export default function PinnedApps() {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [contentHeight, setContentHeight] = useState<number | null>(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2 cursor-pointer">
          <h2 className="text-lg font-normal text-gray-800">Pinned Apps</h2>
        </div>
      </div>

      <div
        style={{
          overflow: "hidden",
          maxHeight: contentHeight ?? 9999,
          transition: "max-height 450ms ease-in-out, opacity 300ms ease",
          opacity: 1,
        }}
      >
        <div className="relative" ref={contentRef}>
          <div>
            <div className="grid grid-cols-2 gap-4">
              {pinnedApps.map((app) => (
                <div key={app.id} className="  w-full min-w-0">
                  <Link to={app.link ?? "#"} className="">
                    <div className="bg-[#F5F5F5] rounded-2xl p-4 cursor-pointer h-full transition-transform duration-200 hover:-translate-y-1 hover:scale-102">
                      <div className="flex flex-col items-start gap-4 mb-3">
                        <div
                          className={`p-2 min-w-10 bg-white rounded-xl flex items-center justify-center`}
                        >
                          <img
                            src={app.icon}
                            alt={`${app.title} app icon`}
                            className="w-auto min-w-6 max-w-12 min-h-4 max-h-7"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 group-hover:text-gray-900 transition-colors">
                            {app.title}
                          </h3>
                        </div>
                      </div>

                      {/* App Description */}
                      <p className="text-sm text-gray-600 group-hover:text-gray-700 line-clamp-1 transition-colors">
                        {app.description}
                      </p>
                      {/*<p className="text-xs mt-3 text-gray-500">
                        {app.lastAccessed}
                      </p>*/}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const pinnedApps: AppCard[] = [
  {
    id: "books",
    title: "Business",
    description: "Built to simplify bookkeeping, auto...",
    lastAccessed: "Just now",
    icon: "/icons/books.png",
    iconBg: "bg-black",
    iconColor: "text-white",
    link: "/dashboard/",
  },
  {
    id: "pos",
    title: "Point of Sale",
    description: "Point of Sale for every business activi...",
    lastAccessed: "11 September",
    icon: "/images/pos.svg",
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
    link: "https://pos.foundry-platform.app",
  },
  // {
  //   id: "lending",
  //   title: "Digital Lending",
  //   description: "Secure access to credit using your trans...",
  //   lastAccessed: "12 September",
  //   icon: "/images/digital_lending.png",
  //   iconBg: "bg-gray-100",
  //   iconColor: "text-gray-600",
  //   link: "#",
  // },
  // {
  //   id: "supply",
  //   title: "Supply Flow",
  //   description: "Connect to international suppliers",
  //   lastAccessed: "12 September",
  //   icon: "/images/Supply_Flow.png",
  //   iconBg: "bg-gray-100",
  //   iconColor: "text-gray-600",
  //   link: "#",
  // },
];
