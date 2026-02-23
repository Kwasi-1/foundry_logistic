import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  onBack?: () => void;
  onIconClick?: () => void;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "5xl" | "6xl";
  contentClassName?: string;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-[80%]",
  "6xl": "max-w-[100%]",
};

export function PageLayout({
  children,
  title,
  icon,
  trailing,
  onBack,
  onIconClick,
  className,
  maxWidth = "4xl",
  contentClassName,
}: PageLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-gray50", className)}>
      {/* Header */}
      <header className="bg-white">
        <div className="mx-auto flex items-center justify-between gap-4 px-6 py-4 md:px-8">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="h-10 w-10 hidden md:flex"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            {icon && (
              <Button
                variant="default"
                size="icon"
                onClick={onIconClick}
                className="h-10 w-10 bg-transparent hover:bg-transparent"
              >
                {icon}
              </Button>
            )}
          </div>

          {/* Center Section */}
          <div className="flex-1 text-center overflow-hidden">
            <h1 className="text-[18px] font-semibold max-w-56 sm:max-w-xs md:max-w-md lg:max-w-none mx-auto text-gray-900 md:text-2xl truncate px-2">
              {title}
            </h1>
          </div>

          {/* Right Section */}
          {trailing ? (
            <div className="flex items-center">{trailing}</div>
          ) : (
            <div className="md:w-[100px]" /> /* Spacer for centering */
          )}
        </div>
      </header>

      {/* Main Content */}
      <main
        className={cn(
          "mx-auto px-4 py-8 md:px-6 md:py-12",
          maxWidthClasses[maxWidth],
          contentClassName,
        )}
      >
        {children}
      </main>
    </div>
  );
}

export default PageLayout;
