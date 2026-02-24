import { queryFn } from "@/services/query.api";
import { setModule } from "@/store/features/global.slice";
import { onUpdatePersistSlice } from "@/store/features/persist.slice";
import { RootState } from "@/store/store";
import { variables } from "@/utils/env";
import { isEmpty } from "lodash";
import { useQueries } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

interface IUseUser {
  users?: {
    params: Partial<{
      page: number;
      limit: number;
      count: number;
      search: string;
    }>;
    setParams: (value: any) => void;
    debouncedValue: any;
  };
}

const useUser = ({ users }: IUseUser) => {
  const global = useSelector((state: RootState) => state.global);
  const sort = (global as any)?.sort;
  const dispatch = useDispatch();

  const queries = useQueries({
    queries: [
      {
        queryKey: [
          "organization",
          users?.params?.page,
          users?.params?.limit,
          users?.debouncedValue,
          sort,
          users?.params?.search,
        ],
        queryFn: () =>
          queryFn({
            url: variables().BASE_URL + "/organization/get",
            params: {
              userPage: users?.params?.page,
              userLimit: users?.params?.limit,
              userSearch: users?.params?.search,
              userSort: sort,
            },
          }),
        refetchOnWindowFocus: false,
        enabled: !isEmpty(users),
      },
      {
        queryKey: ["roles"],
        queryFn: () =>
          queryFn({
            url: variables().BASE_URL + "/misc/roles",
          }),
        refetchOnWindowFocus: false,
      },
    ],
  });

  const [orgQuery, rolesQuery] = queries;

  useEffect(() => {
    if (orgQuery.isSuccess && orgQuery.data) {
      const data: any = orgQuery.data;
      const usersCount = data?.data?.["_count"]?.organizationtostaff;
      users?.setParams({ ...users?.params, count: usersCount });
    }
  }, [orgQuery.isSuccess, orgQuery.data]);

  useEffect(() => {
    if (rolesQuery.isSuccess && rolesQuery.data) {
      const roles = (rolesQuery.data as any)?.data;
      dispatch(onUpdatePersistSlice({ roles }));
    }
  }, [rolesQuery.isSuccess, rolesQuery.data, dispatch]);

  return queries;
};

export default useUser;
