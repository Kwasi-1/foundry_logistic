import useQueryApi from './useQueryApi';
import { variables } from '@/utils/env';

const useFbooksSasToken = () => {
  return useQueryApi({
    key: ['sas-token'],
    url: variables().HR_ACCOUNTING_BASE_URL + '/fbooks-sas-token',
  });
};

export default useFbooksSasToken;
