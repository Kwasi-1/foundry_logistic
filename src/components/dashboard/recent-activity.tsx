import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Check, AlertTriangle, X, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  timestamp: string;
  type: "success" | "warning" | "error" | "info";
}

interface RecentActivityProps {
  activities: Activity[];
  className?: string;
}

export function RecentActivity({ activities, className }: RecentActivityProps) {
  const getTypeStyles = (type: Activity["type"]) => {
    switch (type) {
      case "success":
        return {
          color: "bg-green-100 text-green-700",
          icon: Check,
        };
      case "warning":
        return {
          color: "bg-yellow-100 text-yellow-700",
          icon: AlertTriangle,
        };
      case "error":
        return {
          color: "bg-red-100 text-red-700",
          icon: X,
        };
      default:
        return {
          color: "bg-blue-100 text-blue-700",
          icon: Info,
        };
    }
  };

  return (
    <Card className={cn("bg-white", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const typeStyles = getTypeStyles(activity.type);
            const Icon = typeStyles.icon;
            const userName = activity.user?.name || "User";
            const initials = userName
              .split(" ")
              .map((n) => n[0])
              .join("");

            return (
              <div key={activity?.id} className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={activity.user?.avatar}
                    alt={userName}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {userName}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium",
                        typeStyles.color,
                      )}
                    >
                      <Icon className="h-3 w-3" />
                      {activity.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                  <p className="text-xs text-gray-400">{activity.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
