import { ReactNode } from "react";
import NotFoundPage from "@/pages/not-found";
import { usePermission } from "@/hooks/use-permission";

type PermissionRouteProps = {
  permission?: string;
  anyOf?: string[];
  children: ReactNode;
  fallback?: ReactNode;
};

export function PermissionRoute({
  permission,
  anyOf,
  children,
  fallback,
}: PermissionRouteProps) {
  const { can } = usePermission();
  const allowed = permission
    ? can(permission)
    : anyOf
      ? anyOf.some((perm) => can(perm))
      : true;

  if (!allowed) {
    return <>{fallback ?? <NotFoundPage />}</>;
  }

  return <>{children}</>;
}
