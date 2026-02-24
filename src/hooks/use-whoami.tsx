import { apiClient } from "@/lib/api";
import { useAppDispatch } from "@/store/store";
import { onUpdateUserSlice } from "@/store/features/user.slice";
import { variables } from "@/utils/env";
import { useQuery } from "@tanstack/react-query";

function useWhoami() {
  const dispatch = useAppDispatch();
  useQuery({
    queryKey: ["whoami"],
    queryFn: async () => {
      const { data } = await apiClient({
        url: variables().BUSINESS_API + "/whoami",
        method: "GET",
      });
      dispatch(onUpdateUserSlice(data?.data));
      return data;
    },
  });
  return {};
}

export default useWhoami;

