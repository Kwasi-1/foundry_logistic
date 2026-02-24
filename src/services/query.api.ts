import { apiClient } from "@/lib/api";

interface QueryOptions {
  url: string;
  params?: any;
  header?: any;
}

/**
 * A query function wrapper around apiClient for GET requests
 */
export const queryFn = async (options: QueryOptions): Promise<any> => {
  return await apiClient({
    url: options.url,
    method: "GET",
    params: options.params,
    header: options.header,
  });
};
