import { apiClient } from "@/lib/api";
import { variables } from "@/utils/env";
import { useQuery } from "@tanstack/react-query";

function useSASToken() {
  const { data, isPending } = useQuery({
    queryKey: ["sas-token"],
    queryFn: async () => {
      const { data: Response } = await apiClient({
        url: variables().BUSINESS_API + "/sas-token",
        method: "GET",
      });

      return Response?.data;
    },
    refetchInterval: 10000,
  });
  return {
    data,
    loading: isPending,
  };
  return {};
}

export default useSASToken;
