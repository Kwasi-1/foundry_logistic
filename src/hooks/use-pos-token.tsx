import { apiClient } from "@/lib/api";
import { variables } from "@/utils/env";
import { useQuery } from "@tanstack/react-query";

function usePosSASToken() {
  const { data, isPending } = useQuery({
    queryKey: ["pos-sas-token"],
    queryFn: async () => {
      const { data: Response } = await apiClient({
        url: variables().POS_API + "/misc/sas-token",
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
}

export default usePosSASToken;
