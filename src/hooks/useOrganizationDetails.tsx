import { listDocuments } from '@/lib/api/queries.global';
import { apiClient } from '@/services/api.client';
import { onUpdateOrgDetails } from '@/store/features/accounting.setup.details';
import { RootState } from '@/store/store';
import { variables } from '@/utils/env';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useOrganizationSetupDetails = () => {
  const dispatch = useDispatch();
  const { current_company, name } = useSelector(
    (state: RootState) => state['org-details']
  );

  const { data, isSuccess, isLoading, error, refetch } = useQuery({
    queryKey: ['organization-setup-details'],
    queryFn: () =>
      apiClient({
        url: variables().HR_ACCOUNTING_BASE_URL + '/setup-details',
        method: 'GET',
      }),
  });

  const { data: CompanyList, isSuccess: CompaniesFetchedSuccesfully } =
    useQuery({
      queryKey: ['company-list'],
      queryFn: () =>
        listDocuments({
          url: '/accounting/list/company',
          filters: [],
          start: 0,
          limit: 1001,
        }),
    });

  useEffect(() => {
    if (isSuccess) {
      dispatch(onUpdateOrgDetails(data?.data?.data));
      if (CompaniesFetchedSuccesfully) {
        dispatch(
          onUpdateOrgDetails({
            company_list: Array.from(CompanyList?.data || []).map(
              (company: any) => ({
                company_name: company?.name,
                default_currency: company?.default_currency,
              })
            ),
          })
        );
      }
      if (!current_company) {
        const current_company_defaults: any = Array.from(
          CompanyList?.data || []
        ).find((company: any) => company.company_name == name);
        dispatch(
          onUpdateOrgDetails({
            current_company: name,
            erp_defaults: {
              default_currency: current_company_defaults?.default_currency,
              company_name: current_company_defaults?.company_name,
            },
          })
        );
      }
    }
  }, [isSuccess, data, dispatch, CompaniesFetchedSuccesfully]);

  return { data: data?.data?.data, isLoading, error, isSuccess, refetch };
};

export default useOrganizationSetupDetails;
