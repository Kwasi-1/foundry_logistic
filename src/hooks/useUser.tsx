import { queryFn } from '@/services/query.api';
import { updateGlobalState } from '@/store/features/global';
import { onUpdatePersistSlice } from '@/store/features/persist.slice';
import { RootState } from '@/store/store';
import { variables } from '@/utils/env';
import { isEmpty } from 'lodash';
import { useQueries } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';

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
  const { sort } = useSelector((state: RootState) => state.global);
  const dispatch = useDispatch();

  const queries = useQueries<any>([
    {
      queryKey: [
        'organization',
        users?.params?.page,
        users?.params?.limit,
        users?.debouncedValue,
        sort,
        users?.params?.search,
      ],
      queryFn: () =>
        queryFn({
          url: variables().BASE_URL + '/organization/get',
          params: {
            userPage: users?.params.page,
            userLimit: users?.params.limit,
            userSearch: users?.params.search,
            userSort: sort,
          },
        }),
      onSuccess: (data: any) => {
        const usersCount = data?.data?.['_count']?.organizationtostaff;

        return users?.setParams({ ...users?.params, count: usersCount });
      },
      refetchOnWindowFocus: false,
      enabled: !isEmpty(users),
    },
    {
      queryKey: ['roles'],
      queryFn: () =>
        queryFn({
          url: variables().BASE_URL + '/misc/roles',
        }),
      onSuccess: (data: any) => {
        const roles = data?.data;
        dispatch(onUpdatePersistSlice({ roles }));
        dispatch(updateGlobalState({ roles }));
      },
      refetchOnWindowFocus: false,
    },
  ]);

  return queries as any;
};

export default useUser;
