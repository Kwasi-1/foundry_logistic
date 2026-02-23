import useQueryApi from './useQueryApi';
import { variables } from '@/utils/env';

const useSasToken = () => {
  return useQueryApi({
    key: ['sas-token'],
    url: variables().BASE_URL + '/misc/sas-token',
  });
};

export default useSasToken;
