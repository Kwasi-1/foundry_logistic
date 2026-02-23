import store from "@/store/store";
import { variables } from "@/utils/env";
import axios, { AxiosRequestConfig } from "axios";

interface IOptions {
  url: string;
  token?: string;
  method: string;
  data?: any;
  params?: any;
  header?: any;
}

export const apiClient = async (options: IOptions): Promise<any> => {
  const requestConfig = requestConfigInterface(options);

  return await axios(requestConfig);
};

const requestConfigInterface = (options: IOptions): AxiosRequestConfig<any> => {
  const { token } = store.getState().auth;
  // const { company_list, current_company } = store.getState()["org-details"];
  return {
    method: options.method,
    url: options.url,
    headers: {
      Authorization: `Bearer ${token?.access}`,
      "Cache-Control": "no-cache",
      "Max-Forwards": 3,
      "x-app-env": variables().ENVIRONMENT,
      // ...(Array.from(company_list || []).length > 1
      //   ? {
      //       company: current_company,
      //     }
      //   : {}),
      ...options.header,
    },
    params: options.params,
    data: options.data,
    timeout: 1200000,
    withCredentials: false,
    responseType: options.header?.["responseType"] || "json",
    responseEncoding: "utf8",
    maxRedirects: 5,
    decompress: true,
  };
};
