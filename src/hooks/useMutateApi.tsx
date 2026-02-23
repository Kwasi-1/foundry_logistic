import { mutateFn } from '@/services/mutation.api';
import { useMutation } from 'react-query';

type IUseMutateApi = Partial<{
  url: any;
  key: any;
  header: any;
  method: any;
  alt?: boolean;
  onSuccess: (data: any, variables: any) => void;
  onError: (error: any, variables: any) => void;
}>;

const useMutateApi = ({
  key,
  onSuccess,
  onError,
  url,
  header,
  method = 'POST',
  alt = false
}: IUseMutateApi) => {
  return useMutation({
    mutationKey: key,
    mutationFn: async (variables: any) => {
      const data = await mutateFn({
        data: variables,
        header,
        url,
        method,
      });

      if ([header?.responseType].includes('blob') || alt) {
        return data;
      } else {
        return data?.data;
      }
    },
    onSuccess: onSuccess,
    onError: async (error: any, variables) => {
      onError?.(error, variables);
    },
  });
};


export default useMutateApi;
