import { useQuery } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { onSetPermissions } from "@/store/features/auth.slice";
import { apiClient } from "@/lib/api";
import { variables } from "@/utils/env";

const RBAS_BASE_URL = variables().BUSINESS_API || "http://localhost:7071/api";

const extractPermissionIds = (payload: any) => {
  const permissionModules =
    payload?.permissions ??
    payload?.data?.permissions ??
    payload?.data ??
    payload ??
    [];
  const list: string[] = [];
  (permissionModules || []).forEach((module: any) => {
    (module?.subModules || []).forEach((sub: any) => {
      if (sub?.actions?.read && sub?.id) {
        list.push(String(sub.id));
      }
    });
  });
  return Array.from(new Set(list));
};

type UseRbasPermissionsOptions = {
  enabled?: boolean;
};

export function useRbasPermissions(options: UseRbasPermissionsOptions = {}) {
  const dispatch = useAppDispatch();
  const { permissions } = useAppSelector((state) => state.auth);
  const enabled = options.enabled ?? true;

  useQuery({
    queryKey: ["rbas-permissions"],
    enabled: enabled && permissions === null,
    queryFn: async () => {
      try {
        const { data: response } = await apiClient({
          url: `${RBAS_BASE_URL}/rbas/permissions`,
          method: "GET",
        });
        const payload = response?.data ?? response;
        const permissionIds = extractPermissionIds(payload);
        dispatch(onSetPermissions(permissionIds));
        return permissionIds;
      } catch (error) {
        dispatch(onSetPermissions(["*"]));
        return ["*"];
      }
    },
    retry: false,
  });
}

