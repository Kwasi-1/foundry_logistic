import { useMemo } from "react";
import { useAppSelector } from "@/store/store";

type PermissionSummary = {
  allowed: string[];
  denied: string[];
  can: (permission: string) => boolean;
  cannot: (permission: string) => boolean;
  isReady: boolean;
};

const normalizePermission = (value: string) => value.trim();

const splitPermissions = (values: string[]) => {
  const allowed = new Set<string>();
  const denied = new Set<string>();

  values.forEach((permission) => {
    const normalized = normalizePermission(permission);
    if (!normalized) return;
    if (normalized.startsWith("!")) {
      denied.add(normalized.slice(1));
      return;
    }
    if (normalized.toLowerCase().startsWith("deny:")) {
      denied.add(normalized.slice(5));
      return;
    }
    if (normalized.toLowerCase().startsWith("allow:")) {
      allowed.add(normalized.slice(6));
      return;
    }
    allowed.add(normalized);
  });

  return { allowed, denied };
};

export function usePermission(): PermissionSummary {
  const { permissions, userInfo } = useAppSelector((state) => state.auth);
  const rawPermissionsSource = permissions ?? userInfo?.permissions ?? [];
  const rawPermissions = rawPermissionsSource.filter(
    (value): value is string => typeof value === "string",
  );

  return useMemo(() => {
    const { allowed, denied } = splitPermissions(rawPermissions);
    const allowAll = allowed.has("*");
    const allowedList = Array.from(allowed).filter(
      (permission) => !denied.has(permission),
    );
    const deniedList = Array.from(denied);

    const can = (permission: string) => {
      const normalized = normalizePermission(permission);
      if (!normalized) return false;
      if (denied.has(normalized)) return false;
      if (allowAll) return true;
      if (allowed.size === 0) return false;
      return allowed.has(normalized);
    };

    const cannot = (permission: string) => !can(permission);

    return {
      allowed: allowedList,
      denied: deniedList,
      can,
      cannot,
      isReady: permissions !== null,
    };
  }, [rawPermissions, permissions]);
}
