import { apiClient } from "@/lib/api";

interface MutateOptions {
  url: string;
  data?: any;
  method?: string;
  header?: any;
}

/**
 * A mutation function wrapper around apiClient for POST requests
 */
export const mutateFn = async (options: MutateOptions): Promise<any> => {
  return await apiClient({
    url: options.url,
    method: options.method || "POST",
    data: options.data,
    header: options.header,
  });
};
