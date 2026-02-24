import { useState } from "react";
import CustomContainerComponent from "@/components/shared/custom.container.component";
import LogoComponent from "@/components/shared/logo.component";
import { Icon } from "@iconify/react/dist/iconify.js";

interface Stat {
  label: string;
  value: string | number | React.ReactElement;
  icon?: string;
  bottomText?: string;
  bottomTextColor?: string;
}

interface DashboardProps {
  stats: Stat[];
  isLoading: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, isLoading }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Check if a value is a React element (result of parseToMoney)
  const isMonetaryValue = (value: any): boolean => {
    return typeof value === "object" && value?.type === "span";
  };
  const getGridCols = (count: number) => {
    switch (count) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 md:grid-cols-2";
      case 3:
        return "grid-cols-1 md:grid-cols-3";
      case 4:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
      case 5:
        return "grid-cols-1 md:grid-cols-3 lg:grid-cols-5";
      case 6:
        return "grid-cols-1 md:grid-cols-3 lg:grid-cols-6";
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
    }
  };

  return (
    <div>
      {isLoading ? (
        <CustomContainerComponent
          headerStyles="font-semibold text-[14px]"
          styles="flex flex-col min-h-[120px] px-6"
        >
          <LogoComponent />
        </CustomContainerComponent>
      ) : (
        <div>
          <div className={`grid ${getGridCols(stats.length)} gap-3`}>
            {stats.map((stat, index) => (
              <CustomContainerComponent
                key={index}
                headerStyles="font-semibold text-[14px]"
                styles="flex flex-col min-h-[120px] px-6"
              >
                <div className="flex flex-col h-full">
                  {/* Icon at the top */}
                  {stat.icon && (
                    <div className="mb-2 hidden">
                      <Icon
                        icon={stat.icon}
                        className={`text-lg text-ash-text`}
                      />
                    </div>
                  )}

                  {/* Label */}
                  <h3 className="text-ash-text text-[0.8rem] uppercase font-medium mb-2">
                    {stat.label}
                  </h3>

                  {/* Value */}
                  <div className="flex-1 flex items-center justify-between">
                    <div className="text-xl lg:text-2xl xl:text-2xl font-semibold text-primary-dark">
                      {isMonetaryValue(stat.value) ? (
                        isVisible ? (
                          stat.value
                        ) : (
                          <span className="flex items-center gap-3">
                            <span className="flex items-center gap-3 select-none text-gray-500">
                              <span className="text-3xl mt-4"> *<span className="text-md pb-6">.</span>**</span>
                            </span>
                          </span>
                        )
                      ) : (
                        stat.value
                      )}
                    </div>
                    {isMonetaryValue(stat.value) && (
                      <button
                        onClick={() => setIsVisible(!isVisible)}
                        className="ml-3 p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                        aria-label={isVisible ? "Hide amount" : "Show amount"}
                      >
                        <Icon
                          icon={
                            isVisible
                              ? "mdi:eye-outline"
                              : "mdi:eye-off-outline"
                          }
                          className="text-lg text-gray-500 hover:text-gray-700"
                        />
                      </button>
                    )}
                  </div>

                  {/* Bottom text */}
                  {stat.bottomText && (
                    <div className="mt-4 hidden">
                      <p
                        className={`text-sm ${stat.bottomTextColor || "text-ash-text"}`}
                      >
                        {stat.bottomText}
                      </p>
                    </div>
                  )}
                </div>
              </CustomContainerComponent>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
