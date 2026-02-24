import { apiClient } from "@/lib/api";

export const globalQueries = {
  getOrganization: "/organization/get",
  getRoles: "/misc/roles",
};

export const listDocuments = async (options: {
  url: string;
  filters?: any[];
  start?: number;
  limit?: number;
}) => {
  return await apiClient({
    url: options.url,
    method: "GET",
    params: {
      filters: JSON.stringify(options.filters || []),
      start: options.start || 0,
      limit: options.limit || 20,
    },
  });
};
